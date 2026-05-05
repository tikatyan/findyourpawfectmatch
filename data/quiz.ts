export type Language = "en" | "id"

export type ResultKey = "lowEnergy" | "mediumEnergy" | "highEnergy" | "notReady"

export const quizContent = {
  en: {
    quizTitle: "Meet Your Best Furriend Forever 🐶💗",
    description:
      "Every dog has a unique personality and every family has different needs. Matching energy, care needs, and personality helps ensure a forever home, preventing the risk of stress or rehoming later.",
    questions: [
      {
        question: "How much time do you have each day for a dog?",
        subtitle: "Time together shapes your bond and helps match their needs to your routine.",
        options: [
          { value: "A", label: "Less than 1 hour, I'm kinda busy" },
          { value: "B", label: "1–3 hours, I can make time for walks and cuddles" },
          { value: "C", label: "3+ hours, I love spending time with pets" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1, isRedflag: true },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "Why do you want to adopt a dog?",
        subtitle: 'Your "why" helps us pair you with the right personality.',
        options: [
          { value: "A", label: "For companionship or emotional support" },
          { value: "B", label: "For my family or kids to grow up with" },
          { value: "C", label: "To have an active buddy for walks or adventures" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "What's your living environment like?",
        subtitle: "Different dogs need different amounts of space.",
        options: [
          { value: "A", label: "Apartments or co-living, limited outdoor access" },
          { value: "B", label: "House with some outdoor space" },
          { value: "C", label: "House with a yard or access to nearby open area" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "What's your neighborhood vibe like?",
        subtitle: "We want to make sure your dog will be safe and welcome.",
        options: [
          { value: "A", label: "Not dog-friendly, neighbors might complain" },
          { value: "B", label: "Neutral, no one really minds" },
          { value: "C", label: "Very dog-friendly, other people have dogs too!" },
        ],
        scoringMatrix: {
          A: { low: 0, medium: 0, high: 0 , isRedflag: true},
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 3, medium: 3, high: 3 },
        },
      },
      {
        question: "What's your weekend vibe?",
        subtitle: "Your habits show us the energy level that fits best.",
        options: [
          { value: "A", label: "Mostly chill at home, maybe some Netflix" },
          { value: "B", label: "A mix of outings and stay-ins" },
          { value: "C", label: "Active days out — hiking, jogging, outdoor events" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "Have you ever lived with or cared for a dog before?",
        subtitle: "Experience helps us find a good fit for your comfort level.",
        options: [
          { value: "A", label: "Never, but I'm excited to learn" },
          { value: "B", label: "A little, been around dogs" },
          { value: "C", label: "A lot, I've raised or owned dogs before" },
        ],
        scoringMatrix: {
          A: { low: 2, medium: 2, high: 2 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 3, medium: 3, high: 3 },
        },
      },
      {
        question: "Who's at home with you?",
        subtitle: "Your household influences the kind of dog that will thrive.",
        options: [
          { value: "A", label: "Just me, or with my partner" },
          { value: "B", label: "Kids at home who'd love a furry sibling" },
          { value: "C", label: "Other pets – we've got a mix already" },
        ],
        scoringMatrix: {
          A: { low: 2, medium: 2, high: 3 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 3, medium: 3, high: 2 },
        },
      },
      {
        question: "What's your tolerance for grooming and messes?",
        subtitle: "Coat type affects care needs and daily upkeep.",
        options: [
          { value: "A", label: "Low maintenance please, I like it simple" },
          { value: "B", label: "Some grooming is fine" },
          { value: "C", label: "Happy to brush, bathe, and pamper!" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "Do you have access to veterinary care if your dog needs it?",
        subtitle: "Having a plan for medical care is essential for your dog's wellbeing.",
        options: [
          { value: "A", label: "Not sure, I don't know is there any nearby vets or if I can afford the bills" },
          { value: "B", label: "Yes, I know where to go and can manage costs" },
          { value: "C", label: "Yes, I have a vet I trust and emergency fund ready" },
        ],
        scoringMatrix: {
          A: { low: 0, medium: 0, high: 0 , isRedflag: true},
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 3, medium: 3, high: 3 },
        },
      },
      {
        question: "Are you planning any big life changes soon?",
        subtitle: "Big changes can affect a dog's stability and routine.",
        options: [
          { value: "A", label: "Yes, things are in flux" },
          { value: "B", label: "Hmm not sure, maybe" },
          { value: "C", label: "Nope, I'm staying put for now" },
        ],
        scoringMatrix: {
          A: { low: 0, medium: 0, high: 0 , isRedflag: true},
          B: { low: 1, medium: 1, high: 1 },
          C: { low: 3, medium: 3, high: 3 },
        },
      },
    ],
    results: {
      lowEnergy: {
        title: "You're meant for a chill, low-energy doggo!",
        description:
          "You'd be a great match for a mellow, affectionate dog who's just looking for a safe, loving home. Most senior dogs (>6 years old) fit this vibe too. They often come with big hearts and calm energy, though they might need a bit more care, like vet checkups or meds.",
        image: "/images/low-energy.png",
        color: "bg-blue-100 border-blue-300",
        characteristics: [
          "Calm and relaxed, great for chill routines",
          "Usually already trained and house-mannered",
          "Perfect for quieter homes or gentle lifestyles",
        ],
        examples: [
          "Mongrels (kampung dogs) with gentle, easygoing nature",
          "Pug, French Bulldog, Shih Tzu, Maltese, Dachshund, Cavalier",
        ],
        keepInMind: [
          "Senior dogs may need more vet visits and medication",
          "Still need daily love, care, and connection",
          "If you're sensitive to sound, consider less reactive breeds",
          "Amazing companions for first-time adopters ready for the commitment",
        ],
        nextSteps: [
          "Look for senior dogs or older rescues near you",
          "Try fostering an older dog—it can be life-changing",
          "Visit local shelters and spend time with calm, gentle dogs",
        ],
      },
      mediumEnergy: {
        title: "You're pawfect for a medium-energy doggo!",
        description:
          "You're the kind of person a balanced doggo would thrive with—dogs who enjoy a bit of play, a bit of chill, and lots of bonding. These dogs are friendly, easy to care for, and love being part of a family.",
        image: "/images/medium-energy.png",
        color: "bg-yellow-100 border-yellow-300",
        characteristics: [
          "Medium energy, playful but also loves to nap",
          "Usually great with kids, pets, and even new people",
          "Doesn't need intense training or constant activity",
          "Often healthy and resilient, especially local mixed-breeds",
        ],
        examples: [
          "Mongrels (kampung dogs) with balanced energy",
          "Pomeranian, Poodle (Mini), Corgi, Chihuahua, Mini Pinscher, Terrier, Chow Chow, Golden Retriever",
        ],
        keepInMind: [
          "Needs regular walks, playtime, and bonding",
          "Easier than high-energy dogs, but not low-maintenance",
          "If you want a quieter home, consider less sensitive breeds",
          "Great for beginner adopters who want a bit of everything",
        ],
        nextSteps: [
          "Visit your local shelter and spend time with different personalities",
          "Ask which dogs are best for beginner adopters",
          "Look for adult dogs (1-6 years) with balanced temperaments",
        ],
      },
      highEnergy: {
        title: "You're built for a high-energy doggo!",
        description:
          "You're the type of human who can keep up with a bouncy, curious, and playful pup! Active dogs—especially puppies—need daily exercise, playtime, and mental stimulation. They're perfect for someone who's got the time and energy, and they'll repay you with loyalty, fun, and pure joy.",
        image: "/images/high-energy.png",
        color: "bg-green-100 border-green-300",
        characteristics: [
          "High energy and super curious about everything",
          "Needs regular outdoor time and interaction",
          "Strong bond with humans, often clingy in the best way",
          "Great match if your routine already includes lots of movement",
        ],
        examples: [
          "Mongrels (kampung dogs) with high energy",
          "Beagle, Jack Russell Terrier, Shiba Inu, Border Collie, Samoyed, Husky, Dobermann",
        ],
        keepInMind: [
          "Requires daily activity: walks, play, or training",
          "Not ideal if you're frequently away from home",
          "Perfect if you want a loyal buddy to join you on life's adventures",
        ],
        nextSteps: [
          "Consider if you have space or nearby parks for walks",
          "Ask shelters about enrichment needs and training tips",
          "Look for young adult dogs or puppies that need active families",
        ],
      },
      notReady: {
        title: "It might not be the right time, and that's okay",
        description:
          "Maybe now's not the perfect moment for a dog, and that's 100% valid. But here's the good news: there are still so many meaningful ways you can support rescue dogs without adopting (yet). Every little bit helps.",
        image: "/images/not-ready.png",
        color: "bg-red-100 border-red-300",
        characteristics: [
          "Your current situation may not be ideal for a dog yet",
          "There are many ways to help without adopting",
          "Preparing now can lead to a better match later",
        ],
        examples: ["Volunteering at shelters", "Fostering dogs temporarily", "Supporting rescue organizations"],
        keepInMind: [
          "Every bit of help makes a difference",
          "Your support is valued and needed",
          "When you're ready, adoption will be more rewarding",
        ],
        nextSteps: [
          "Follow local rescue accounts or shelters in your city",
          "DM a shelter and ask if they need help — most do!",
          "Join a community of dog-loving friends for future support",
          "Volunteer at your local shelter (even just a few hours makes a big difference)",
          "Foster a dog temporarily — give them a safe home while they wait for adoption",
          "Donate food, meds, or supplies to shelters near you",
          "Share dog adoption posts on Instagram or WhatsApp — you never know who might see it and fall in love",

        ],
      },
    },
  },
  id: {
    quizTitle: "Siapa ya best furriend baruku? 🐶💗",
    description:
      "Setiap doggo punya kepribadian unik dan setiap keluarga punya kebutuhan berbeda. Dengan mengetahui seberapa cocok calon anjing dengan gaya hidup kamu, kita bisa mengurangi risiko stres dan rehoming di kemudian hari.",
    questions: [
      {
        question: "Berapa banyak waktu yang bisa kamu luangkan buat anjingmu setiap hari?",
        subtitle: "Banyaknya waktu bonding dengan mereka perlu disesuaikan dengan rutinitasmu.",
        options: [
          { value: "A", label: "Kurang dari 1 jam, aku lumayan sibuk" },
          { value: "B", label: "1–3 jam, aku masih sempat ajak mereka jalan dan main" },
          { value: "C", label: "3+ jam, aku suka banget menghabiskan waktu sama mereka!" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 , isRedflag: true},
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "Kenapa kamu ingin punya doggo?",
        subtitle: "Alasan kamu membantu kami mencocokkan dengan kepribadian yang sesuai.",
        options: [
          { value: "A", label: "Buat jadi teman hidup atau emotional support" },
          { value: "B", label: "Untuk tumbuh bersama menjadi bagian dari keluarga" },
          { value: "C", label: "Temenin berpetualang atau jalan-jalan" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "Seperti apa tempat tinggalmu saat ini?",
        subtitle: "Setiap anjing punya kebutuhan space yang berbeda.",
        options: [
          { value: "A", label: "Apartemen atau kos, gak banyak akses ke outdoor" },
          { value: "B", label: "Rumah dengan sedikit area outdoor" },
          { value: "C", label: "Rumah dengan halaman atau akses ke area terbuka" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "Apa lingkungan sekitar tempat tinggalmu ramah doggo?",
        subtitle: "Kami mau memastikan anjingmu aman dan bisa diterima sekeliling.",
        options: [
          { value: "A", label: "Kurang ramah, tetanggaku mungkin komplain" },
          { value: "B", label: "Netral, gak ada yang terlalu permasalahin" },
          { value: "C", label: "Sangat ramah, banyak yang punya anjing juga!" },
        ],
        scoringMatrix: {
          A: { low: 0, medium: 0, high: 0, isRedflag: true },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 3, medium: 3, high: 3 },
        },
      },
      {
        question: "Biasanya kalau weekend kamu ngapain?",
        subtitle: "Kebiasaan ini perlu match dengan energy-level doggo nanti.",
        options: [
          { value: "A", label: "Kebanyakan santai di rumah saja" },
          { value: "B", label: "Kadang keluar rumah, tapi kadang juga di rumah" },
          { value: "C", label: "Olahraga yang seru — hiking, lari, kembali ke alam" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "Pernah tinggal bareng atau merawat anjing sebelumnya?",
        subtitle: "Beda tipe doggo, beda level difficulty dalam merawatnya.",
        options: [
          { value: "A", label: "Belum pernah, tapi aku pengen banget belajar" },
          { value: "B", label: "Aku pernah punya anjing, tapi bukan aku yang merawat" },
          { value: "C", label: "Aku pernah pelihara dan merawat sendiri" },
        ],
        scoringMatrix: {
          A: { low: 2, medium: 2, high: 2 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 3, medium: 3, high: 3 },
        },
      },
      {
        question: "Siapa aja yang tinggal sama kamu di rumah?",
        subtitle: "Orang (atau hewan) lain yang tinggal denganmu bisa memengaruhi kecocokan kalian.",
        options: [
          { value: "A", label: "Cuma aku (atau dengan pasangan)" },
          { value: "B", label: "Ada anak-anak kecil yang bakal senang punya furry friends" },
          { value: "C", label: "Aku punya peliharaan lain di rumah" },
        ],
        scoringMatrix: {
          A: { low: 2, medium: 3, high: 2 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 3, medium: 3, high: 2 },
        },
      },
      {
        question: "Seberapa rajin kamu merawat kerapihan dan kebersihan?",
        subtitle: "Setiap tipe doggo punya kebutuhan perawatan yang berbeda.",
        options: [
          { value: "A", label: "Kalau bisa yang low maintenance aja" },
          { value: "B", label: "Sedikit maintenance gak masalah" },
          { value: "C", label: "Aku mau banget sisirin, mandiin, gunting kuku, dan manjain mereka" },
        ],
        scoringMatrix: {
          A: { low: 3, medium: 2, high: 1 },
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 1, medium: 2, high: 3 },
        },
      },
      {
        question: "Kalau anjingmu sakit, apakah kamu punya akses ke dokter hewan?",
        subtitle: "In case ada apa-apa dengan anjingmu nanti.",
        options: [
          { value: "A", label: "Sepertinya di sekitarku gak ada dokter hewan. Aku juga agak khawatir sama biayanya" },
          { value: "B", label: "Ada, aku tahu harus ke mana dan bisa afford biayanya" },
          { value: "C", label: "Ada, aku udah punya dokter hewan langganan dan siap kalau emergency" },
        ],
        scoringMatrix: {
          A: { low: 0, medium: 0, high: 0 , isRedflag: true},
          B: { low: 2, medium: 3, high: 2 },
          C: { low: 3, medium: 3, high: 3 },
        },
      },
      {
        question: "Ada rencana perubahan besar hidup dalam waktu dekat?",
        subtitle: "Perubahan besar bisa memengaruhi stabilitas dan rutinitas anjing.",
        options: [
          { value: "A", label: "Iya, sepertinya akan ada perubahan besar" },
          { value: "B", label: "Mungkin, tapi rencananya belum matang" },
          { value: "C", label: "Nggak, kondisiku cukup stabil untuk sekarang" },
        ],
        scoringMatrix: {
          A: { low: 0, medium: 0, high: 0, isRedflag: true },
          B: { low: 1, medium: 1, high: 1 },
          C: { low: 3, medium: 3, high: 3 },
        },
      },
    ],
    results: {
      lowEnergy: {
        title: "Doggo kalem, low-energy pawfect buat kamu!",
        description:
          "Kamu akan cocok banget dengan anjing yang santai, penuh kasih, dan cuma butuh rumah yang aman dan penuh cinta. Banyak anjing senior (>6 tahun) yang punya energi seperti ini — mereka lovely, tenang, tapi mungkin butuh perawatan ekstra seperti cek rutin ke dokter atau obat.",
        image: "/images/low-energy.png",
        color: "bg-blue-100 border-blue-300",
        characteristics: [
          "Tenang dan rileks, cocok untuk gaya hidup santai",
          "Biasanya sudah terlatih dan terbiasa di rumah",
          "Tidak terlalu sering menggong-gong",
        ],
        examples: ["Anjing kampung dengan sifat tenang", "Pug, French Bulldog, Shih Tzu, Maltese, Dachshund, Cavalier"],
        keepInMind: [
          "Anjing senior mungkin butuh lebih sering ke dokter dan berobat",
          "Biarpun low energy, mereka tetap butuh kasih sayang dan perhatian setiap hari",
          "Kalau kamu sensitif sama suara, pilih ras yang tidak terlalu reaktif",
          "Cocok untuk adopter pemula yang siap berkomitmen",
        ],
        nextSteps: [
          "Kunjungi shelter dan habiskan waktu dengan anjing yang kalem",
          "Cari anjing senior atau anjing dewasa di sekitarmu",
          "Coba jadi foster untuk anjing senior — bisa jadi pengalaman yang life changing!",
        ],
      },
      mediumEnergy: {
        title: "Doggo dengan energi sedang pawfect buat kamu!",
        description:
          "Kamu tipe orang yang pas untuk anjing yang energinya seimbang — suka main, suka santai, dan senang diajak bonding. Anjing seperti ini ramah, mudah dirawat, dan senang jadi bagian keluarga.",
        image: "/images/medium-energy.png",
        color: "bg-yellow-100 border-yellow-300",
        characteristics: [
          "Energi sedang, suka main tapi juga suka tidur siang",
          "Biasanya akrab dengan anak-anak, hewan lain, dan orang baru",
          "Tidak perlu latihan intens atau aktivitas nonstop",
          "Cenderung sehat dan tangguh, apalagi anjing lokal",
        ],
        examples: [
          "Anjing kampung dengan energi seimbang",
          "Pomeranian, Poodle Mini, Corgi, Chihuahua, Mini Pinscher, Terrier, Chow Chow, Golden Retriever",
        ],
        keepInMind: [
          "Mereka tetap butuh diajak jalan rutin, main, dan bonding",
          "Lebih mudah dirawat daripada anjing high-energy, tapi bukan berarti low-maintenance",
          "Jika ingin rumah lebih tenang, pilih ras yang tidak terlalu sensitif",
          "Cocok untuk adopter pemula yang mau 'campuran' santai dan aktif",
        ],
        nextSteps: [
          "Kunjungi shelter dan kenalan dengan berbagai karakter anjing",
          "Tanya anjing mana yang cocok untuk adopter pemula",
          "Cari anjing dewasa (1–6 tahun) dengan temperamen seimbang",
        ],
      },
      highEnergy: {
        title: "Doggo aktif, berenergi tinggi pawfect buat kamu!",
        description:
          "Kamu tipe orang yang bisa mengikuti ritme anjing yang aktif, penasaran, dan suka bermain! Anjing tipe ini, apalagi yang masih kecil, butuh olahraga, permainan, dan stimulasi mental setiap hari.",
        image: "/images/high-energy.png",
        color: "bg-green-100 border-green-300",
        characteristics: [
          "Tidak mudah capek dan super penasaran",
          "Butuh waktu rutin di luar rumah untuk main dan berinteraksi",
          "Sangat dekat dengan manusia, sering nempel dengan cara yang manis",
          "Cocok buat kamu yang rutinitasnya penuh aktivitas",
        ],
        examples: [
          "Anjing kampung yang super aktif",
          "Beagle, Jack Russell Terrier, Shiba Inu, Border Collie, Samoyed, Husky, Dobermann",
        ],
        keepInMind: [
          "Butuh aktivitas harian: jalan, main, atau latihan",
          "Tidak ideal jika sering meninggalkan rumah",
          "Cocok untuk yang mau teman setia untuk ikut petualangan hidup",
        ],
        nextSteps: [
          "Pastikan tempat tinggalmu cukup luas atau ada akses ke taman untuk jalan",
          "Tanya shelter tentang kebutuhan enrichment dan tips melatih",
          "Consider puppy yang sedang mencari keluarga baru",
        ],
      },
      notReady: {
        title: "Mungkin belum waktunya, tapi gak apa-apa",
        description:
          "Bisa jadi sekarang belum waktu yang pas untuk punya doggo, dan itu wajar. Kabar baiknya: masih banyak cara meaningful untuk membantu anjing rescue tanpa harus adopsi dulu.",
        image: "/images/not-ready.png",
        color: "bg-red-100 border-red-300",
        characteristics: [
          "Situasi kamu mungkin belum ideal untuk anjing",
          "Ada banyak cara untuk membantu tanpa adopsi",
          "Persiapan sekarang bisa bikin adopsi di masa depan lebih rewarding",
        ],
        examples: ["Volunteer di shelter", "Fostering anjing sementara", "Support organisasi rescue"],
        keepInMind: [
          "Setiap bantuan sangat berarti",
          "Support kamu dihargai dan dibutuhkan",
          "Ketika siap, adopsi akan jauh lebih memuaskan",
        ],
        nextSteps: [
          "Follow akun rescue atau shelter di kotamu",
          "DM shelter dan tanya apakah mereka butuh bantuan",
          "Ikut komunitas pecinta anjing untuk dukungan nanti",
          "Jadi volunteer di shelter terdekat (beberapa jam saja sudah sangat berarti)",
          "Jadi foster — beri rumah sementara sambil mereka menunggu adopter",
          "Donasi makanan, obat, atau perlengkapan ke shelter",
          "Share postingan adopsi di Instagram atau WhatsApp — siapa tahu ada yang cocok",
        ],
      },
    },
  },
}
