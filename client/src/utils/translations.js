// Bilingual dictionary for Indore Sathi AI marketplace (English & Hindi)

export const translations = {
  en: {
    cityBadge: 'Indore · more cities soon',
    appName: 'RoomTiffin',
    sathiName: 'Sathi',
    tagline: 'Tell Sathi what you need. Indore does the rest.',
    sathiSubtitle: 'AI-first local companion for rooms and homestyle tiffins.',
    searchPlaceholder: 'Tell Sathi: e.g. "single room with WiFi near Vijay Nagar under 8000"...',
    aiThinking: 'Sathi is analyzing Indore listings...',
    quickPromptTitle: 'Popular Indore prompts:',
    exploreHub: 'Explore Indore Hubs',
    nav: {
      home: 'Home',
      sathiAi: 'Sathi AI',
      rooms: 'Rooms & PGs',
      tiffin: 'Tiffin & Dabba',
      saved: 'Saved',
      requests: 'Requests',
      refer: 'Refer & Earn',
      becomeHost: 'List with Sathi',
      signIn: 'Sign In',
      joinFree: 'Join Free',
      profile: 'Profile',
      admin: 'Admin Console'
    },
    categories: {
      rooms: {
        title: 'Rooms & PGs in Indore',
        subtitle: 'Verified student PGs, flat shares & executive coliving near Vijay Nagar, Bhawarkuan & Palasia.',
        action: 'Schedule Room Tour',
        perUnit: 'month'
      },
      tiffin: {
        title: 'Tiffin & Dabba in Indore',
        subtitle: 'Authentic Malwa, Gujarati & Jain homestyle meal subscriptions delivered fresh daily.',
        action: 'Book Sample Meal Trial',
        perUnit: 'meal'
      }
    },
    guestLock: {
      title: 'Sign in to unlock exact location and direct contact.',
      badge: 'Protected Address'
    },
    prompts: [
      'single room with WiFi near Vijay Nagar under 8000',
      'pure veg tiffin near Bhawarkuan for coaching',
      'verified PG near Palasia with attached bathroom'
    ]
  },
  hi: {
    cityBadge: 'इंदौर · अन्य शहर जल्द',
    appName: 'रूमटिफिन',
    sathiName: 'साथी',
    tagline: 'साथी को बताएं अपनी ज़रूरत. बाकी इंदौर करेगा.',
    sathiSubtitle: 'कमरे और घर के टिफिन के लिए आपका स्थानीय AI साथी.',
    searchPlaceholder: 'साथी से कहें: जैसे "विजय नगर के पास 8000 में वाईफाई वाला रूम"...',
    aiThinking: 'साथी इंदौर के विकल्पों की जांच कर रहा है...',
    quickPromptTitle: 'इंदौर के लोकप्रिय सवाल:',
    exploreHub: 'इंदौर के इलाके देखें',
    nav: {
      home: 'होम',
      sathiAi: 'साथी AI',
      rooms: 'कमरे और पीजी',
      tiffin: 'टिफिन सेवा',
      saved: 'सहेजे गए',
      requests: 'अनुरोध',
      refer: 'रेफर और कमाएं',
      becomeHost: 'साथी पर लिस्ट करें',
      signIn: 'साइन इन',
      joinFree: 'खाता बनाएं',
      profile: 'प्रोफाइल',
      admin: 'व्यवस्थापक'
    },
    categories: {
      rooms: {
        title: 'इंदौर में कमरे और पीजी',
        subtitle: 'भंवरकुआं, विजय नगर और पलासिया में सत्यापित छात्र पीजी और फ्लैट.',
        action: 'रूम देखने का समय लें',
        perUnit: 'महीना'
      },
      tiffin: {
        title: 'इंदौर में टिफिन और डब्बा',
        subtitle: 'शुद्ध शाकाहारी, मालवी और जैन घर का बना खाना, रोजाना डिलीवरी.',
        action: 'सैंपल थाली मंगाएं',
        perUnit: 'थाली'
      }
    },
    guestLock: {
      title: 'सटीक पता और नंबर देखने के लिए साइन इन करें.',
      badge: 'सुरक्षित पता'
    },
    prompts: [
      'विजय नगर के पास 8000 में वाईफाई वाला कमरा',
      'भंवरकुआं कोचिंग के पास शुद्ध शाकाहारी टिफिन',
      'पलासिया के पास अटैच्ड बाथरूम वाला सत्यापित पीजी'
    ]
  }
}

export const useTranslation = (lang = 'en') => {
  return translations[lang] || translations.en
}
