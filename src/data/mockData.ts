/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnrollmentRecord, KitStatus, SystemLogs } from '../types';

export const CONGO_PROVINCES = [
  'Bas-Uele',
  'Équateur',
  'Haut-Katanga',
  'Haut-Lomami',
  'Haut-Uele',
  'Ituri',
  'Kasaï',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Kinshasa',
  'Kongo-Central',
  'Kwango',
  'Kwilu',
  'Lomami',
  'Lualaba',
  'Mai-Ndombe',
  'Maniema',
  'Mongala',
  'Nord-Kivu',
  'Nord-Ubangi',
  'Sankuru',
  'Sud-Kivu',
  'Sud-Ubangi',
  'Tanganyika',
  'Tshopo',
  'Tshuapa'
];

export interface ProvinceGeo {
  chefLieu: string;
  territoires: string[];
  villages: Record<string, string[]>;
}

export const CONGO_PROVINCES_GEOGRAPHY: Record<string, ProvinceGeo> = {
  'Bas-Uele': {
    chefLieu: 'Buta',
    territoires: ['Buta', 'Aketi', 'Ango', 'Bambesa', 'Bondo', 'Poko'],
    villages: {
      'Buta': ['Baye', 'Koteli', 'Tolo', 'Mobayi'],
      'Aketi': ['Dulia', 'Mambati', 'Gala', 'Komba'],
      'Ango': ['Gwane', 'Digba', 'Bili', 'Sukadi'],
      'Bambesa': ['Dingila', 'Zobia', 'Bomili', 'Ganga'],
      'Bondo': ['Ganga', 'Mongala', 'Bili', 'Yakoma'],
      'Poko': ['Zobia', 'Kanyen', 'Teli', 'Poko-Centre']
    }
  },
  'Équateur': {
    chefLieu: 'Mbandaka',
    territoires: ['Bikoro', 'Lukolela', 'Basankusu', 'Makanza', 'Bomongo', 'Ingende'],
    villages: {
      'Bikoro': ['Iboko', 'Iyonda', 'Ntondo', 'Bokonda'],
      'Lukolela': ['Myra', 'Mpama', 'Liranga', 'Biteke'],
      'Basankusu': ['Waka', 'Boso-Ndjanoa', 'Bokakata', 'Lilanga'],
      'Makanza': ['Mobenzene', 'Lusengo', 'Makanza-Centre', 'Bongonde'],
      'Bomongo': ['Boko', 'Ganga', 'Mokolo', 'Imbonga'],
      'Ingende': ['Bokatola', 'Eonza', 'Wendji', 'Bokote']
    }
  },
  'Haut-Katanga': {
    chefLieu: 'Lubumbashi',
    territoires: ['Kipushi', 'Sakania', 'Mitwaba', 'Pweto', 'Kambove', 'Kasenga'],
    villages: {
      'Kipushi': ['Kanga', 'Kimbangu', 'Shindaika', 'Kafubu'],
      'Sakania': ['Mokambo', 'Musoshi', 'Tshinsenda', 'Kamatanda'],
      'Mitwaba': ['Mura', 'Kisele', 'Kalera', 'Kanzenze'],
      'Pweto': ['Kilwa', 'Lukonzolwa', 'Londe', 'Mutabi'],
      'Kambove': ['Bunkeya', 'Mwadingusha', 'Mulungwishi', 'Lofo'],
      'Kasenga': ['Mingulu', 'Lofoi', 'Kasomeno', 'Kashiobwe']
    }
  },
  'Haut-Lomami': {
    chefLieu: 'Kamina',
    territoires: ['Bukama', 'Kabongo', 'Kamina', 'Malemba-Nkulu', 'Sandoa'],
    villages: {
      'Bukama': ['Luena', 'Kabondo-Dianda', 'Bukama-Centre', 'Kisanga'],
      'Kabongo': ['Kitenge', 'Katongola', 'Kabongo-Mission', 'Kinkoko'],
      'Kamina': ['Lovo', 'Katombo', 'Kamina-Base', 'Mwilambwe'],
      'Malemba-Nkulu': ['Museka', 'Kiabukwa', 'Malemba-Centre', 'Nshimba'],
      'Sandoa': ['Kayembe', 'Sandoa-Poste', 'Samutete', 'Kala']
    }
  },
  'Haut-Uele': {
    chefLieu: 'Isiro',
    territoires: ['Dungu', 'Faradje', 'Niangara', 'Rungu', 'Wamba', 'Watsa'],
    villages: {
      'Dungu': ['Faradje', 'Duru', 'Dungu-Centre', 'Mokoto'],
      'Faradje': ['Aba', 'Tadu', 'Faradje-Centre', 'Konde'],
      'Niangara': ['Kpaika', 'Malingindo', 'Niangara-Est', 'Nambia'],
      'Rungu': ['Neisu', 'Tora', 'Rungu-Poste', 'Ganga'],
      'Wamba': ['Ibambi', 'Mambasa', 'Wamba-Centre', 'Pawa'],
      'Watsa': ['Durba', 'Moku', 'Watsa-Centre', 'Giro']
    }
  },
  'Ituri': {
    chefLieu: 'Bunia',
    territoires: ['Aru', 'Djugu', 'Irumu', 'Mahagi', 'Mambasa'],
    villages: {
      'Aru': ['Ariwara', 'Kengezi-Base', 'Adu', 'Kidi'],
      'Djugu': ['Fataki', 'Kilo', 'Mongbwalu', 'Nizi'],
      'Irumu': ['Komanda', 'Marabo', 'Bunia-Rural', 'Tchabi'],
      'Mahagi': ['Ngote', 'Kwandruma', 'Mahagi-Port', 'Katanga'],
      'Mambasa': ['Niania', 'Epulu', 'Mambasa-Centre', 'Lolwa']
    }
  },
  'Kasaï': {
    chefLieu: 'Tshikapa',
    territoires: ['Dekese', 'Ilebo', 'Kamonia', 'Luebo', 'Mweka'],
    villages: {
      'Dekese': ['Banga', 'Boleme', 'Dekese-Sud', 'Yemo'],
      'Ilebo': ['Sankuru', 'Basongo', 'Ilebo-Gare', 'Kashimpa'],
      'Kamonia': ['Tshisenge', 'Mushenge', 'Kamonia-Centre', 'Kandjaji'],
      'Luebo': ['Nshimba', 'Luanza', 'Luebo-Centre', 'Kamambele'],
      'Mweka': ['Kakenge', 'Mushenge', 'Mweka-Centre', 'Demba']
    }
  },
  'Kasaï-Central': {
    chefLieu: 'Kananga',
    territoires: ['Demba', 'Dibaya', 'Dimbelenge', 'Kazumba', 'Luiza'],
    villages: {
      'Demba': ['Bena-Leka', 'Lubudi', 'Demba-Nord', 'Tshala'],
      'Dibaya': ['Tshimbulu', 'Kamponde', 'Dibaya-Mission', 'Lubanza'],
      'Dimbelenge': ['Katende', 'Mashala', 'Dimbelenge-Sud', 'Nkoto'],
      'Kazumba': ['Bilomba', 'Mikalayi', 'Kazumba-Centre', 'Tshibala'],
      'Luiza': ['Yangala', 'Masuika', 'Luiza-Poste', 'Kalonji']
    }
  },
  'Kasaï-Oriental': {
    chefLieu: 'Mbuji-Mayi',
    territoires: ['Kabeya-Kamwanga', 'Katanda', 'Lupatapata', 'Miabi', 'Tshilenge'],
    villages: {
      'Kabeya-Kamwanga': ['Keena-Kuna', 'Bena-Mpiana', 'Munkamba', 'Bena-Tshisulu'],
      'Katanda': ['Bena-Nshimba', 'Kaza-Banza', 'Katanda-Gare', 'Tshisulu'],
      'Lupatapata': ['Tshijiba', 'Kankelenge', 'Lupatapata-Centre', 'Tshimanga'],
      'Miabi': ['Boyane', 'Kakona', 'Miabi-Sud', 'Mulundu'],
      'Tshilenge': ['Kanyama', 'Lukelenge', 'Tshilenge-Poste', 'Nshimba']
    }
  },
  'Kinshasa': {
    chefLieu: 'Kinshasa',
    territoires: ['Nsele', 'Maluku', 'Kinkole'],
    villages: {
      'Nsele': ['Kinkole', 'Kimpoko', 'Badara', 'Mikonga'],
      'Maluku': ['Menkao', 'Mutiene', 'Maluku-Centre', 'Dumi'],
      'Kinkole': ['Kingabwa', 'Mikonga', 'Kinkole-Pêcheurs', 'Maman-Olive']
    }
  },
  'Kongo-Central': {
    chefLieu: 'Matadi',
    territoires: ['Kasangulu', 'Madimba', 'Mbanza-Ngungu', 'Seke-Banza', 'Songololo', 'Moanda'],
    villages: {
      'Kasangulu': ['Lukaya', 'Luila', 'Kifuma', 'Kasangulu-Gare'],
      'Madimba': ['Kisantu', 'Inkisi', 'Nselo', 'Lemfu'],
      'Mbanza-Ngungu': ['Kolo-Fuma', 'Gombe-Matadi', 'Kimpese', 'Kolo-Mission'],
      'Seke-Banza': ['Kiniati', 'Isangila', 'Seke-Banza-Centre', 'Kinzau-Mvuete'],
      'Songololo': ['Lufu', 'Kimpesse', 'Songololo-Poste', 'Kimpese-Rural'],
      'Moanda': ['Muanda-Village', 'Banana', 'Nsiambo', 'Vista']
    }
  },
  'Kwango': {
    chefLieu: 'Kenge',
    territoires: ['Feshi', 'Kahemba', 'Kasongo-Lunda', 'Kenge', 'Popokabaka'],
    villages: {
      'Feshi': ['Mukedi', 'Kimbongo', 'Feshi-Centre', 'Yasa'],
      'Kahemba': ['Kajiji', 'Shamasango', 'Kahemba-Poste', 'Bindu'],
      'Kasongo-Lunda': ['Kimbau', 'Panu', 'Kasongo-Centre', 'Wamba'],
      'Kenge': ['Wamba', 'Kitu', 'Kenge-Nord', 'Bukanga-Lonzo'],
      'Popokabaka': ['Kingungi', 'Kabuba', 'Popokabaka-Centre', 'Tshimbau']
    }
  },
  'Kwilu': {
    chefLieu: 'Bandundu',
    territoires: ['Bagata', 'Bulungu', 'Gungu', 'Idiofa', 'Masi-Manimba'],
    villages: {
      'Bagata': ['Kikongo', 'Fatundu', 'Bagata-Gare', 'Misay'],
      'Bulungu': ['Kikwit-Sacré', 'Djuma', 'Bulungu-Poste', 'Kimbau'],
      'Gungu': ['Kandolo', 'Kilembe', 'Gungu-Centre', 'Lukibu'],
      'Idiofa': ['Kalo', 'Mangai', 'Idiofa-Sud', 'Banga'],
      'Masi-Manimba': ['Pay-Kongila', 'Kikongo', 'Masi-Centre', 'Mosango']
    }
  },
  'Lomami': {
    chefLieu: 'Kabinda',
    territoires: ['Kabinda', 'Kamiji', 'Lubao', 'Luilu', 'Ngandajika'],
    villages: {
      'Kabinda': ['Bena-Kalebwe', 'Baluba', 'Kabinda-Poste', 'Lukashi'],
      'Kamiji': ['Bena-Munyji', 'Kalonji', 'Kamiji-Gare', 'Kasengu'],
      'Lubao': ['Kisengwa', 'Tshofa', 'Lubao-Centre', 'Kiboko'],
      'Luilu': ['Mwene-Ditu', 'Luputa', 'Luilu-Nord', 'Tshilomba'],
      'Ngandajika': ['Kanyama', 'Kasha', 'Ngandajika-Centre', 'Tshioji']
    }
  },
  'Lualaba': {
    chefLieu: 'Kolwezi',
    territoires: ['Dilolo', 'Kapanga', 'Mutshatsha', 'Sandoa', 'Lubudi'],
    villages: {
      'Dilolo': ['Kasaji', 'Luashi', 'Dilolo-Poste', 'Kajama'],
      'Kapanga': ['Musumba', 'Kalamba', 'Kapanga-Centre', 'Sandoa-Est'],
      'Mutshatsha': ['Fungurume', 'Kando', 'Mutshatsha-Centre', 'Sandoa-Ouest'],
      'Sandoa': ['Samutete', 'Tshisenge', 'Sandoa-Centre', 'Lulua'],
      'Lubudi': ['Luena', 'Mukabe-Kasari', 'Lubudi-Gare', 'Kisanfu']
    }
  },
  'Mai-Ndombe': {
    chefLieu: 'Inongo',
    territoires: ['Inongo', 'Kiri', 'Kutu', 'Oshwe', 'Bolobo', 'Yumbi'],
    villages: {
      'Inongo': ['Bokoro', 'Nioki', 'Inongo-Rural', 'Ibiza'],
      'Kiri': ['Berenio', 'Lokolama', 'Kiri-Centre', 'Pendjua'],
      'Kutu': ['Nioki', 'Semedji', 'Kutu-Centre', 'Bokoro-Sud'],
      'Oshwe': ['Taketa', 'Lokolama', 'Oshwe-Sud', 'Tolo'],
      'Bolobo': ['Bongende', 'Musha', 'Bolobo-Nord', 'Tshumbiri'],
      'Yumbi': ['Nkolo', 'Moba', 'Yumbi-Centre', 'Kalamu']
    }
  },
  'Maniema': {
    chefLieu: 'Kindu',
    territoires: ['Kabambare', 'Kailo', 'Kasongo', 'Kibombo', 'Lubutu', 'Pangi', 'Punia'],
    villages: {
      'Kabambare': ['Kama', 'Salamabila', 'Kabambare-Est', 'Lulimba'],
      'Kailo': ['Kalima', 'Lulu', 'Kailo-Centre', 'Amadi'],
      'Kasongo': ['Manya', 'Kimbombo', 'Kasongo-Poste', 'Mulu'],
      'Kibombo': ['Sama', 'Bahombo', 'Kibombo-Gare', 'Pangi-Sud'],
      'Lubutu': ['Obokote', 'Tingi-Tingi', 'Lubutu-Poste', 'Masese'],
      'Pangi': ['Kalima', 'Kasese', 'Pangi-Centre', 'Lubile'],
      'Punia': ['Yumbi', 'Kasese', 'Punia-Poste', 'Lubutu-Nord']
    }
  },
  'Mongala': {
    chefLieu: 'Lisala',
    territoires: ['Bumba', 'Lisala', 'Bongandanga'],
    villages: {
      'Bumba': ['Yambuku', 'Ebonda', 'Bumba-Port', 'Yaligimba'],
      'Lisala': ['Bingila', 'Upoto', 'Lisala-Rural', 'Kaba'],
      'Bongandanga': ['Bosobolo', 'Yaligimba', 'Bongandanga-Sud', 'Lolo']
    }
  },
  'Nord-Kivu': {
    chefLieu: 'Goma',
    territoires: ['Beni', 'Lubero', 'Masisi', 'Nyiragongo', 'Rutshuru', 'Walikale'],
    villages: {
      'Beni': ['Oicha', 'Kasindi', 'Mbau', 'Bulongo'],
      'Lubero': ['Kirumba', 'Kayna', 'Kanyabayonga', 'Musienene'],
      'Masisi': ['Sake', 'Kitchanga', 'Mweso', 'Rubaya'],
      'Nyiragongo': ['Kibati', 'Munigi', 'Kanyaruchinya', 'Kibumba'],
      'Rutshuru': ['Kiwanja', 'Bunagana', 'Rutshuru-Centre', 'Rubare'],
      'Walikale': ['Mubi', 'Kibua', 'Walikale-Poste', 'Itebero']
    }
  },
  'Nord-Ubangi': {
    chefLieu: 'Gbadolite',
    territoires: ['Bosobolo', 'Mobayi-Mbongo', 'Yakoma', 'Businga'],
    villages: {
      'Bosobolo': ['Bili', 'Giri', 'Bosobolo-Sud', 'Kavugi'],
      'Mobayi-Mbongo': ['Kaya', 'Sango', 'Mobayi-Centre', 'Gboya'],
      'Yakoma': ['Abumombazi', 'Wapinda', 'Yakoma-Port', 'Gatanga'],
      'Businga': ['Loko', 'Karawa', 'Businga-Gare', 'Giri-Nord']
    }
  },
  'Sankuru': {
    chefLieu: 'Lusambo',
    territoires: ['Katako-Kombe', 'Kole', 'Lodja', 'Lomela', 'Lubefu', 'Lusambo'],
    villages: {
      'Katako-Kombe': ['Wembo-Nyama', 'Tshumbe', 'Katako-Nord', 'Loto'],
      'Kole': ['Bena-Dibele', 'Dekese', 'Kole-Gare', 'Oshwe-Est'],
      'Lodja': ['Kingo', 'Oshwe', 'Lodja-Poste', 'Tshudi'],
      'Lomela': ['Bahamba', 'Tshudi', 'Lomela-Sud', 'Kanyama'],
      'Lubefu': ['Mondombe', 'Bena-Leka', 'Lubefu-Centre', 'Tshofa'],
      'Lusambo': ['Bena-Kalonji', 'Sankuru', 'Lusambo-Gare', 'Kasha']
    }
  },
  'Sud-Kivu': {
    chefLieu: 'Bukavu',
    territoires: ['Fizi', 'Kabare', 'Kalehe', 'Mwenga', 'Shabunda', 'Uvira', 'Walungu', 'Idjwi'],
    villages: {
      'Fizi': ['Baraka', 'Minembwe', 'Sebele', 'Mboko'],
      'Kabare': ['Katana', 'Miti', 'Kavumu', 'Murhesa'],
      'Kalehe': ['Minova', 'Ihimbi', 'Kalehe-Centre', 'Nyabibwe'],
      'Mwenga': ['Kamituga', 'Sange', 'Mwenga-Poste', 'Lulingu'],
      'Shabunda': ['Lulingu', 'Kigulube', 'Shabunda-Centre', 'Mulungu'],
      'Uvira': ['Kiliba', 'Sange', 'Luvungi', 'Runingu'],
      'Walungu': ['Nyangezi', 'Kaniola', 'Walungu-Centre', 'Mushinga'],
      'Idjwi': ['Bugarula', 'Rambo', 'Kihumba', 'Mwendo']
    }
  },
  'Sud-Ubangi': {
    chefLieu: 'Gemena',
    territoires: ['Budjala', 'Kungu', 'Libenge', 'Gemena'],
    villages: {
      'Budjala': ['Businga', 'Ndage', 'Budjala-Sud', 'Kavugi'],
      'Kungu': ['Dongo', 'Komba', 'Kungu-Port', 'Gatanga'],
      'Libenge': ['Zongo', 'Mawuya', 'Libenge-Centre', 'Gboya'],
      'Gemena': ['Bwamanda', 'Tandala', 'Gemena-Rural', 'Kavugi']
    }
  },
  'Tanganyika': {
    chefLieu: 'Kalemie',
    territoires: ['Kabalo', 'Kalemie', 'Kongolo', 'Manono', 'Moba', 'Nyunzu'],
    villages: {
      'Kabalo': ['Katibili', 'Lukuga', 'Kabalo-Gare', 'Kasinge'],
      'Kalemie': ['Moba', 'Niemba', 'Kalemie-Rural', 'Kabeya'],
      'Kongolo': ['Sola', 'Mbulula', 'Kongolo-Centre', 'Kasinga'],
      'Manono': ['Kiambi', 'Ankoro', 'Manono-Poste', 'Kasinge'],
      'Moba': ['Kirungu', 'Kala', 'Moba-Port', 'Vista'],
      'Nyunzu': ['Kabeya-Mayi', 'Muhala', 'Nyunzu-Sud', 'Sango']
    }
  },
  'Tshopo': {
    chefLieu: 'Kisangani',
    territoires: ['Bafwasende', 'Banalia', 'Basoko', 'Isangi', 'Opala', 'Ubundu', 'Yahuma'],
    villages: {
      'Bafwasende': ['Opienge', 'Mambasa', 'Bafwasende-Sud', 'Bili'],
      'Banalia': ['Kole', 'Panga', 'Banalia-Gare', 'Kavugi'],
      'Basoko': ['Lokutu', 'Yanonge', 'Basoko-Port', 'Gatanga'],
      'Isangi': ['Yatolema', 'Yangambi', 'Isangi-Centre', 'Yangambi-Rural'],
      'Opala': ['Yatolema', 'Lowe', 'Opala-Centre', 'Gboya'],
      'Ubundu': ['Kisanga', 'Biaro', 'Ubundu-Gare', 'Kavugi'],
      'Yahuma': ['Bosele', 'Yaleke', 'Yahuma-Nord', 'Gboya']
    }
  },
  'Tshuapa': {
    chefLieu: 'Boende',
    territoires: ['Befale', 'Boende', 'Bokungu', 'Djolu', 'Ikela', 'Monkoto'],
    villages: {
      'Befale': ['Mumpono', 'Baringa', 'Befale-Centre', 'Kavugi'],
      'Boende': ['Wema', 'Bokote', 'Boende-Rural', 'Gboya'],
      'Bokungu': ['Yandongi', 'Monkoto', 'Bokungu-Sud', 'Gatanga'],
      'Djolu': ['Yalosemba', 'Lingomo', 'Djolu-Centre', 'Kavugi'],
      'Ikela': ['Yalifafu', 'Gombela', 'Ikela-Sud', 'Gboya'],
      'Monkoto': ['Wamba', 'Salonga', 'Monkoto-Poste', 'Kavugi']
    }
  }
};

export const ENROLLMENT_CENTERS: Record<string, string[]> = {
  'Kinshasa': ['Gombe - Maison Civile', 'Limete - Maison Commune', 'Nsele - Kit Biométrique Mobile 01', 'Bandalungwa - Foyer Social'],
  'Nord-Kivu': ['Goma - Centre Don Bosco', 'Beni - Hôtel de Ville', 'Butembo - Lycée Nyakasanza', 'Masisi - Kit Mobile Solaire 04'],
  'Sud-Kivu': ['Bukavu - Collège Alfajiri', 'Uvira - Maison du Citoyen', 'Fizi - Antenne Mobile Solaire 12'],
  'Haut-Katanga': ['Lubumbashi - Place Royale', 'Likasi - Bureau du Territoire', 'Kasumbalesa - Poste Frontière'],
  'Kongo-Central': ['Matadi - Port Autonome', 'Boma - Bureau ONIP', 'Mbanza-Ngungu - Salle Paroissiale'],
  'Lualaba': ['Kolwezi - Hôtel du Gouvernement', 'Dilolo - Poste Frontière'],
  'Tshopo': ['Kisangani - Alliance Française', 'Isangi - Antenne Mobile Solaire 02']
};

export const MOCK_CITIZENS: EnrollmentRecord[] = [
  {
    id: 'REC-2026-001',
    status: 'AWAITING_BIOMETRICS',
    citizen: {
      id: 'CIT-10932',
      lastName: 'KABAMBA',
      postName: 'MULUMBA',
      firstName: 'Merveille',
      gender: 'F',
      birthDate: '1998-04-12',
      birthPlace: 'Kinshasa',
      originProvince: 'Kasai-Oriental',
      currentAddress: 'Avenue de la Justice, N° 45',
      currentCity: 'Gombe, Kinshasa',
      currentProvince: 'Kinshasa',
      phone: '+243 812 345 678',
      email: 'm.kabamba@gamil.cd',
      justificationDoc: 'ACTE_NAISSANCE',
      justificationDocName: 'acte_de_naissance_merveille.pdf',
      photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=80',
      qrCodeData: 'IDCONGO:KABAMBA:MULUMBA:Merveille:F:1998-04-12:Kinshasa:ACTE_NAISSANCE:HASH90812F98D',
      preEnrolledAt: '2026-07-05T10:14:22Z',
      appointmentCenter: 'Gombe - Maison Civile',
      appointmentDate: '2026-07-07',
      appointmentTime: '10:00 - 10:30'
    }
  },
  {
    id: 'REC-2026-002',
    status: 'COMPLETED',
    nin: 'NIN-1985-COD-89472019',
    voterCardNumber: 'CENI-VOTE-9082348',
    enrolledAt: '2026-06-28T09:15:00Z',
    citizen: {
      id: 'CIT-08472',
      lastName: 'BARAKA',
      postName: 'MAHESHE',
      firstName: 'Abraham',
      gender: 'M',
      birthDate: '1985-11-23',
      birthPlace: 'Lubumbashi',
      originProvince: 'Haut-Katanga',
      currentAddress: 'Quartier Golf, Rue des Écrivains, N° 12',
      currentCity: 'Lubumbashi',
      currentProvince: 'Haut-Katanga',
      phone: '+243 998 765 432',
      email: 'abraham.baraka@maheshe.cd',
      justificationDoc: 'CERTIFICAT_NATIONALITE',
      justificationDocName: 'certificat_nationalite_baraka.pdf',
      photoUrl: '/src/assets/images/abraham_baraka_headshot_1783380003224.jpg',
      qrCodeData: 'IDCONGO:BARAKA:MAHESHE:Abraham:M:1985-11-23:Lubumbashi:CERTIFICAT_NATIONALITE:HASH78239A',
      preEnrolledAt: '2026-06-25T14:20:00Z',
      appointmentCenter: 'Lubumbashi - Place Royale',
      appointmentDate: '2026-06-28',
      appointmentTime: '09:00 - 09:30'
    },
    biometrics: {
      leftFingerprints: [true, true, true, true],
      rightFingerprints: [true, true, true, true],
      irisScanned: true,
      facialMatchScore: 98,
      biometricsValidatedAt: '2026-06-28T09:12:44Z'
    }
  },
  {
    id: 'REC-2026-003',
    status: 'AWAITING_BIOMETRICS',
    citizen: {
      id: 'CIT-23849',
      lastName: 'MWAMBA',
      postName: 'NGALULA',
      firstName: 'Sarah',
      gender: 'F',
      birthDate: '1992-07-30',
      birthPlace: 'Goma',
      originProvince: 'Nord-Kivu',
      currentAddress: 'Avenue du Lac, N° 88',
      currentCity: 'Goma',
      currentProvince: 'Nord-Kivu',
      phone: '+243 854 991 231',
      email: 'sarah.mwamba@goma.org',
      justificationDoc: 'ACTE_NAISSANCE',
      justificationDocName: 'acte_naissance_sarah.png',
      photoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop&q=80',
      qrCodeData: 'IDCONGO:MWAMBA:NGALULA:Sarah:F:1992-07-30:Goma:ACTE_NAISSANCE:HASH12389BC82',
      preEnrolledAt: '2026-07-06T08:30:15Z',
      appointmentCenter: 'Goma - Centre Don Bosco',
      appointmentDate: '2026-07-08',
      appointmentTime: '11:00 - 11:30'
    }
  },
  {
    // Simulate a fraud attempt (someone registering again under a false name, but having BARAKA's fingerprints)
    id: 'REC-2026-FRAUD',
    status: 'AWAITING_BIOMETRICS',
    citizen: {
      id: 'CIT-99999',
      lastName: 'ILUNGA',
      postName: 'KABEYA',
      firstName: 'Alphonse',
      gender: 'M',
      birthDate: '1987-01-15',
      birthPlace: 'Mwene-Ditu',
      originProvince: 'Lomami',
      currentAddress: 'Avenue Kasavubu, N° 192',
      currentCity: 'Limete, Kinshasa',
      currentProvince: 'Kinshasa',
      phone: '+243 821 111 222',
      email: 'alphonse.ilunga@yahoo.fr',
      justificationDoc: 'ATTESTATION_NOTORIETE',
      justificationDocName: 'attestation_notoriete_ilunga.pdf',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      qrCodeData: 'IDCONGO:ILUNGA:KABEYA:Alphonse:M:1987-01-15:Mwene-Ditu:ATTESTATION_NOTORIETE:FRAUDHASH78239A',
      preEnrolledAt: '2026-07-06T12:00:00Z',
      appointmentCenter: 'Gombe - Maison Civile',
      appointmentDate: '2026-07-07',
      appointmentTime: '14:00 - 14:30'
    },
    notes: 'ATTENTION : Ce profil sert à simuler la détection de doublons biométriques (ABIS). Ses empreintes correspondront à celles de Abraham BARAKA.'
  }
];

export const MOCK_KITS: KitStatus[] = [
  {
    id: 'KIT-CGO-101',
    province: 'Kongo-Central',
    location: 'Sekebanza (Milieu Rural)',
    status: 'ONLINE',
    batteryLevel: 98,
    solarCharging: true,
    solarPowerWatts: 45,
    pendingSyncCount: 0,
    lastSyncTime: '2026-07-06T13:45:00Z'
  },
  {
    id: 'KIT-NK-402',
    province: 'Nord-Kivu',
    location: 'Masisi (Zone Enclavée)',
    status: 'OFFLINE_ACTIVE',
    batteryLevel: 72,
    solarCharging: true,
    solarPowerWatts: 38,
    pendingSyncCount: 14,
    lastSyncTime: '2026-07-05T17:30:00Z'
  },
  {
    id: 'KIT-SK-508',
    province: 'Sud-Kivu',
    location: 'Kavumu (Zone Rurale)',
    status: 'SYNCING',
    batteryLevel: 85,
    solarCharging: false,
    solarPowerWatts: 0,
    pendingSyncCount: 3,
    lastSyncTime: '2026-07-06T14:15:00Z'
  },
  {
    id: 'KIT-KAT-204',
    province: 'Haut-Katanga',
    location: 'Sakania (Brousse)',
    status: 'OFFLINE_ACTIVE',
    batteryLevel: 42,
    solarCharging: true,
    solarPowerWatts: 55,
    pendingSyncCount: 22,
    lastSyncTime: '2026-07-04T12:00:00Z'
  },
  {
    id: 'KIT-TSH-303',
    province: 'Tshopo',
    location: 'Yatolema (Forêt Équatoriale)',
    status: 'ONLINE',
    batteryLevel: 100,
    solarCharging: true,
    solarPowerWatts: 60,
    pendingSyncCount: 0,
    lastSyncTime: '2026-07-06T14:00:00Z'
  }
];

export const INITIAL_LOGS: SystemLogs[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-07-06T13:58:12Z',
    type: 'SUCCESS',
    source: 'ABIS',
    message: 'Déduplication en temps réel complétée pour REC-2026-002 (Aucun doublon trouvé. NIN généré).'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-07-06T14:00:00Z',
    type: 'INFO',
    source: 'KIT',
    message: 'Kit KIT-TSH-303 (Tshopo - Yatolema) connecté avec succès par liaison satellite. Lancement de la synchronisation.'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-07-06T14:02:15Z',
    type: 'SUCCESS',
    source: 'CENI',
    message: 'Fichier électoral de la circonscription Lubumbashi-Ville mis à jour (+1 électeur).'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-07-06T14:05:00Z',
    type: 'WARNING',
    source: 'KIT',
    message: 'Kit KIT-NK-402 (Masisi) est déconnecté (Fonctionnement hors-ligne autonome actif). 14 enregistrements chiffrés en attente de synchronisation.'
  }
];
