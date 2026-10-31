/**
 * MVP: No ads yet.
 * These functions are scaffolding so later we can swap in real AdMob rewarded/interstitial/banner.
 */

export async function showRewardedAd(placement = 'unknown') {
  // Later: load/show rewarded video and resolve success only if reward callback fires.
  return { success: true, provider: 'stub', placement };
}

export async function showInterstitialAd(placement = 'unknown') {
  return { success: true, provider: 'stub', placement };
}

export async function showBannerAd(placement = 'unknown') {
  return { success: true, provider: 'stub', placement };
}

export async function hideBannerAd() {
  return { success: true, provider: 'stub' };
}