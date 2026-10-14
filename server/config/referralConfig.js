// Configurable referral reward rules for RoomTiffin Finder

export const REFERRAL_CONFIG = {
  FRIEND_WELCOME_CREDIT: 100, // ₹100 welcome credit for friend upon signup with code
  REFERRER_FIRST_REQUEST_CREDIT: 200, // ₹200 wallet credit for referrer when friend completes first request
  FRIEND_FIRST_REQUEST_BONUS: 100, // ₹100 extra credit for friend when they complete first request
  MONTHLY_REFERRAL_CAP: 2000, // ₹2,000 max referral reward per user per month
  EXPIRY_DAYS: 30, // Reward validity days
  MILESTONES: [
    { target: 3, tier: "Bronze Pioneer", bonus: 150, badge: "🥉" },
    { target: 10, tier: "Silver Ambassador", bonus: 500, badge: "🥈" },
    { target: 25, tier: "Gold Legend", bonus: 1500, badge: "🥇" }
  ]
}

export default REFERRAL_CONFIG
