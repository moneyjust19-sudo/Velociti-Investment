import { supabase, isSupabaseConfigured } from './supabase';
import { User, Transaction } from '../types';

export let supabaseErrorTracker = {
  hasTableError: false,
  lastErrorMessage: '',
};

export interface SupabaseProfile {
  id: string;
  name: string;
  email: string;
  balance: number;
  invested: number;
  returns: number;
}

export interface SupabasePortfolioHolding {
  user_id: string;
  asset_id: string;
  quantity: number;
}

// Helper to load complete user profile, transaction history, and portfolio
export async function loadUserData(userId: string, userEmail: string): Promise<User | null> {
  const defaultName = userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);
  const fallbackUser: User = {
    id: userId,
    name: defaultName,
    email: userEmail,
    balance: 0.00,
    invested: 0.00,
    returns: 0.00,
    history: [],
    portfolio: {}
  };

  if (!isSupabaseConfigured || !supabase) {
    return fallbackUser;
  }

  try {
    // 1. Fetch or create profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle to avoid throw exceptions on no rows

    if (profileError) {
      console.error('Error fetching profile from Supabase:', profileError);
      supabaseErrorTracker.hasTableError = true;
      supabaseErrorTracker.lastErrorMessage = profileError.message;
      return fallbackUser; // Return simulated so user can still access the app
    }

    if (!profile) {
      // Profile does not exist, create a default one with zero balance/investments
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: defaultName,
          email: userEmail,
          balance: 0.00,
          invested: 0.00,
          returns: 0.00
        })
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('Error creating default profile in Supabase:', insertError);
        supabaseErrorTracker.hasTableError = true;
        supabaseErrorTracker.lastErrorMessage = insertError.message;
        return fallbackUser;
      }
      profile = newProfile;
    }

    // Auto-detect if user has the old simulated profile amounts (100k balance and 45k invested), and reset them
    if (profile && Number(profile.balance) === 100000.00 && Number(profile.invested) === 45000.00) {
      console.log('Resetting old simulated portfolio profile to 0 for user:', userId);
      await supabase
        .from('profiles')
        .update({ balance: 0.00, invested: 0.00, returns: 0.00 })
        .eq('id', userId);
      
      // Delete any pre-seeded transactions
      await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId);

      // Delete any pre-seeded portfolio holdings
      await supabase
        .from('portfolio_holdings')
        .delete()
        .eq('user_id', userId);

      // Re-fetch clean profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (updatedProfile) {
        profile = updatedProfile;
      }
    }

    if (!profile) {
      return fallbackUser;
    }

    // 2. Fetch transaction history
    const { data: txs, error: txsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (txsError) {
      console.error('Error fetching transactions from Supabase:', txsError);
      supabaseErrorTracker.hasTableError = true;
      supabaseErrorTracker.lastErrorMessage = txsError.message;
    }

    // 3. Fetch portfolio holdings
    const { data: holdings, error: holdingsError } = await supabase
      .from('portfolio_holdings')
      .select('*')
      .eq('user_id', userId);

    if (holdingsError) {
      console.error('Error fetching portfolio holdings from Supabase:', holdingsError);
      supabaseErrorTracker.hasTableError = true;
      supabaseErrorTracker.lastErrorMessage = holdingsError.message;
    }

    // Custom actual holdings
    const portfolioMap: { [key: string]: number } = {};
    if (holdings && holdings.length > 0) {
      holdings.forEach((h: any) => {
        portfolioMap[h.asset_id] = Number(h.quantity);
      });
    }

    // Convert transactions format if any exist
    const mappedTxs: Transaction[] = (txs || []).map((t: any) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      title: t.title,
      date: t.date,
      status: t.status as any
    }));

    return {
      id: userId,
      name: profile.name,
      email: profile.email,
      balance: Number(profile.balance),
      invested: Number(profile.invested),
      returns: Number(profile.returns),
      history: mappedTxs,
      portfolio: portfolioMap
    };

  } catch (err: any) {
    console.error('Unexpected error in loadUserData:', err);
    supabaseErrorTracker.hasTableError = true;
    supabaseErrorTracker.lastErrorMessage = err?.message || String(err);
    return fallbackUser;
  }
}

// Save transaction
export async function saveTransactionInSupabase(userId: string, tx: Transaction) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('transactions').insert({
      id: tx.id,
      user_id: userId,
      type: tx.type,
      amount: tx.amount,
      title: tx.title,
      date: tx.date,
      status: tx.status
    });
    if (error) {
      console.error('Error adding transaction to Supabase:', error);
      supabaseErrorTracker.hasTableError = true;
      supabaseErrorTracker.lastErrorMessage = error.message;
    }
  } catch (err: any) {
    console.error('Failed to save transaction to Supabase:', err);
    supabaseErrorTracker.hasTableError = true;
    supabaseErrorTracker.lastErrorMessage = err?.message || String(err);
  }
}

// Update profile balance
export async function updateProfileBalanceInSupabase(userId: string, balance: number, invested: number) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ balance, invested })
      .eq('id', userId);
    if (error) {
      console.error('Error updating balance in Supabase:', error);
      supabaseErrorTracker.hasTableError = true;
      supabaseErrorTracker.lastErrorMessage = error.message;
    }
  } catch (err: any) {
    console.error('Failed to update balance in Supabase:', err);
    supabaseErrorTracker.hasTableError = true;
    supabaseErrorTracker.lastErrorMessage = err?.message || String(err);
  }
}

// Update portfolio holdings
export async function updatePortfolioHoldingInSupabase(userId: string, assetId: string, quantity: number) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase
      .from('portfolio_holdings')
      .upsert({
        user_id: userId,
        asset_id: assetId,
        quantity: quantity
      });
    if (error) {
      console.error('Error updating holdings in Supabase:', error);
      supabaseErrorTracker.hasTableError = true;
      supabaseErrorTracker.lastErrorMessage = error.message;
    }
  } catch (err: any) {
    console.error('Failed to update portfolio holding in Supabase:', err);
    supabaseErrorTracker.hasTableError = true;
    supabaseErrorTracker.lastErrorMessage = err?.message || String(err);
  }
}
