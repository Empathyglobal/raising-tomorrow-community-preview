// Juvenile Justice Pack - Data & Engine
// Version 1.0

// --- CONSTANTS ---
export const JJ_CHECK_AGES = [6, 8, 10, 12, 14, 16];

// --- SCENARIO DATA ---

const JJ_SCENARIOS = {
  6: [
    { id:"JJ06_T01", age:6, kind:"temptation", tier:0, offense:"tempt_stickers", caughtBias:0.00,
      hook:"{childName} comes home staring at a shiny sticker sheet in their hand. They whisper, “I really wanted it. I almost just… took it.” They haven’t taken anything yet, but the urge is right there on the surface.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ06_T02", age:6, kind:"temptation", tier:0, offense:"tempt_candy", caughtBias:0.00,
      hook:"At the store, {childName} keeps circling the candy near the register. In the car they ask, very seriously, “If I put it in my pocket, does it still count if it’s small?” They’re testing the rule like it’s a science experiment.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ06_T03", age:6, kind:"temptation", tier:0, offense:"tempt_lost_found", caughtBias:0.00,
      hook:"At school pickup, {childName} points at the lost-and-found bin and says, “Nobody wants that stuff. Could I keep it?” Then they add, quieter: “What if I just take it?” The question lands heavier than their voice.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ06_T04", age:6, kind:"temptation", tier:0, offense:"tempt_change_jar", caughtBias:0.00,
      hook:"You catch {childName} staring at the change jar like it’s treasure. They ask, “If I take one coin and you don’t notice… is that stealing?” They watch your face for permission or fear.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ06_T05", age:6, kind:"temptation", tier:0, offense:"tempt_blame_shift", caughtBias:0.00,
      hook:"A toy breaks during play. {childName} pauses, then asks, “What if I say it was already broken?” It’s not about the toy—it’s about what truth is allowed to be.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ06_T06", age:6, kind:"temptation", tier:0, offense:"tempt_friend_toy", caughtBias:0.00,
      hook:"{childName} talks about a friend’s toy like it belongs to them. When you ask why, they say, “I like it more. I should have it.” Their logic is simple—and unsettling.", revealCaught:"", revealNotCaught:"" },

    { id:"JJ06_I01", age:6, kind:"incident", tier:1, offense:"petty_shoplift_candy", caughtBias:0.14,
      hook:"A small candy ends up with {childName} that you didn’t buy. When you ask where it came from, they freeze—then offer a fast, shaky explanation that keeps changing.",
      revealCaught:"A store employee recognizes you later and calmly explains they saw what happened. It’s a first warning, but it’s real.",
      revealNotCaught:"No one has contacted you yet. The only proof is the candy—and {childName}’s reaction when you mention it." },
    { id:"JJ06_I02", age:6, kind:"incident", tier:1, offense:"classroom_item_taken", caughtBias:0.10,
      hook:"A classmate’s small item appears in {childName}’s backpack. {childName} insists, “I was just borrowing it,” but the owner was upset enough that adults started asking questions.",
      revealCaught:"The teacher calls you in. They want the item returned and a plan to stop this from becoming a pattern.",
      revealNotCaught:"The teacher hasn’t called yet—but another parent has started asking around." },
    { id:"JJ06_I03", age:6, kind:"incident", tier:1, offense:"lost_found_taken", caughtBias:0.08,
      hook:"You spot something familiar from the school’s lost-and-found in {childName}’s room. {childName} watches you carefully, like your reaction decides what rules exist.",
      revealCaught:"A staff member notices it’s missing and asks families to return anything taken. Your child’s name comes up quickly.",
      revealNotCaught:"Nobody has noticed yet. It’s small enough to hide—but big enough to teach a lesson either way." },
    { id:"JJ06_I04", age:6, kind:"incident", tier:1, offense:"library_book_walkout", caughtBias:0.12,
      hook:"A library book shows up at home with no checkout receipt. {childName} says they “forgot” to tell anyone and wants to keep reading it like nothing happened.",
      revealCaught:"The librarian contacts you politely but firmly: the book was taken without checking out.",
      revealNotCaught:"No one has called… yet. The due date stamp feels like a ticking clock." },
    { id:"JJ06_I05", age:6, kind:"incident", tier:1, offense:"marker_from_teacher", caughtBias:0.06,
      hook:"{childName} has a new marker set that wasn’t bought at home. When asked, they shrug: “It was just there.” The shrug is too casual to be innocent.",
      revealCaught:"The teacher notices supplies missing and asks parents to check backpacks. Your child’s set matches.",
      revealNotCaught:"No one has said anything. It’s the kind of quiet theft that becomes a habit." },
    { id:"JJ06_I06", age:6, kind:"incident", tier:1, offense:"snack_extortion", caughtBias:0.10,
      hook:"You overhear {childName} bragging: “If they want to sit with us, they have to share snacks.” It’s not a punch—it’s leverage.",
      revealCaught:"A teacher reports that another child cried about being pressured. Adults are paying attention now.",
      revealNotCaught:"No teacher has called, but your child’s pride in the story is a warning sign." },
    { id:"JJ06_I07", age:6, kind:"incident", tier:1, offense:"bathroom_scribbles", caughtBias:0.18,
      hook:"The school mentions repeated scribbles on walls in places kids aren’t supposed to draw. {childName} comes home with crayon marks on their hands and a grin they can’t hide.",
      revealCaught:"Staff connect the timing and your child’s handwriting. It’s handled quietly, but it’s still vandalism.",
      revealNotCaught:"There’s no proof yet—just suspicious hands and suspicious confidence." },
    { id:"JJ06_I08", age:6, kind:"incident", tier:1, offense:"broke_neighbor_item", caughtBias:0.12,
      hook:"A neighbor’s small decoration ends up broken after kids played nearby. {childName} tries to vanish into the background the moment the topic comes up.",
      revealCaught:"A neighbor says they saw who was closest when it happened. They want an apology and help replacing it.",
      revealNotCaught:"No one saw it clearly. Your child’s silence is the loudest clue." },
    { id:"JJ06_I09", age:6, kind:"incident", tier:1, offense:"took_lunch_money", caughtBias:0.15,
      hook:"{childName} has extra coins and can’t explain where they came from. Their answer is too quick, too practiced, like a line they prepared.",
      revealCaught:"A staff member calls: another child’s lunch money went missing and the stories aren’t matching.",
      revealNotCaught:"No one has contacted you yet. Your child’s sudden “riches” feel like a test." },
    { id:"JJ06_I10", age:6, kind:"incident", tier:2, offense:"used_parent_phone_purchase", caughtBias:0.06,
      hook:"You notice an unexpected purchase on a device. {childName} says, “It was just one button.” The honesty arrives only after the receipt does.",
      revealCaught:"Customer support emails confirm the purchase and time. There’s no pretending it didn’t happen.",
      revealNotCaught:"Nothing external flags it—only your own account history reveals the choice your child made." },
    { id:"JJ06_I11", age:6, kind:"incident", tier:1, offense:"took_friend_home_item", caughtBias:0.04,
      hook:"After a playdate, a parent mentions a small item is missing. Later, you spot it tucked away at home. {childName} avoids your eyes like eye contact is a confession.",
      revealCaught:"The other parent directly asks you to check your house. It’s uncomfortable—and clarifying.",
      revealNotCaught:"No one has asked yet. But it’s only a matter of time before someone notices." },
    { id:"JJ06_I12", age:6, kind:"incident", tier:1, offense:"pretend_found_money", caughtBias:0.05,
      hook:"{childName} suddenly offers to buy snacks for themselves with money they shouldn’t have. When questioned, they say, “I found it,” like the phrase fixes everything.",
      revealCaught:"A teacher reports missing classroom change and asks families to talk to kids about honesty.",
      revealNotCaught:"No one else knows. Your child is watching whether you accept the line." },
    { id:"JJ06_I13", age:6, kind:"incident", tier:1, offense:"takes_without_asking_home", caughtBias:0.03,
      hook:"Small things disappear at home—coins, treats, little objects—and {childName} acts offended that you even asked. The pattern is tiny, but the attitude is big.",
      revealCaught:"You catch them in the act one evening. There’s no space left for denial.",
      revealNotCaught:"Nothing is provable in the moment—just a growing list of missing small things." },
    { id:"JJ06_I14", age:6, kind:"incident", tier:2, offense:"repeat_small_thefts", caughtBias:0.08,
      hook:"You find a “stash” of little items under {childName}’s bed—miscellaneous, mismatched, obviously not all theirs. It looks less like one mistake and more like a collection.",
      revealCaught:"A teacher and another parent both reach out the same week. Adults are connecting dots.",
      revealNotCaught:"No one has called yet—but the stash suggests this isn’t a one-time event." }
  ],
  8: [
    { id:"JJ08_T01", age:8, kind:"temptation", tier:0, offense:"tempt_peer_dare", caughtBias:0.00,
      hook:"{childName} admits a friend dared them to steal something small “just to prove it.” They say it like it’s a challenge, not a wrongdoing, and watch to see if you’ll laugh or flinch.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ08_T02", age:8, kind:"temptation", tier:0, offense:"tempt_forge_note", caughtBias:0.00,
      hook:"{childName} asks what your signature looks like “from memory.” Then, a beat later, they add: “If I signed your name, would anyone know?” It’s a question shaped like a plan.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ08_T03", age:8, kind:"temptation", tier:0, offense:"tempt_keep_found_phone", caughtBias:0.00,
      hook:"At the park, {childName} finds someone’s lost phone. They turn it in their hands and say, “What if we keep it?” They aren’t desperate—they’re curious.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ08_T04", age:8, kind:"temptation", tier:0, offense:"tempt_skip_small_fee", caughtBias:0.00,
      hook:"{childName} jokes about getting into something without paying. “It’s not stealing,” they say, “it’s just… skipping.” They test words like loopholes.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ08_T05", age:8, kind:"temptation", tier:0, offense:"tempt_prank_damage", caughtBias:0.00,
      hook:"{childName} describes a “funny prank” idea that would damage something minor. They don’t sound cruel—just thrilled by the thought of getting away with it.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ08_T06", age:8, kind:"temptation", tier:0, offense:"tempt_take_from_fundraiser", caughtBias:0.00,
      hook:"{childName} sees a fundraiser envelope and asks, “If we borrow a little and put it back later… is that still wrong?” They want your answer to become permission.", revealCaught:"", revealNotCaught:"" },

    { id:"JJ08_I01", age:8, kind:"incident", tier:1, offense:"shoplift_small_trinket", caughtBias:0.16,
      hook:"A small trinket shows up at home that {childName} clearly didn’t pay for. They act brave about it for three seconds—then the bravado cracks when you don’t smile.",
      revealCaught:"A store volunteer recognizes you and calmly reports what they saw. It’s handled as a warning, but it’s documented.",
      revealNotCaught:"No one has confronted them yet. The only confrontation is the one happening in your home." },
    { id:"JJ08_I02", age:8, kind:"incident", tier:2, offense:"forged_signature", caughtBias:0.12,
      hook:"A school paper appears with your name signed—except it isn’t your handwriting. {childName} tries to explain it like it’s clever problem-solving, not lying.",
      revealCaught:"The teacher flags the signature and calls you. There’s disappointment in their voice, not anger.",
      revealNotCaught:"No one has called yet. But the paper is still in circulation, waiting to be noticed." },
    { id:"JJ08_I03", age:8, kind:"incident", tier:2, offense:"took_cash_playdate", caughtBias:0.08,
      hook:"After a visit to a friend’s home, {childName} has cash they can’t explain. Their story is too polished for an eight-year-old—like someone coached them.",
      revealCaught:"The other parent contacts you directly. They’re not yelling. That almost makes it worse.",
      revealNotCaught:"No one has asked yet. The money sits like a secret that wants to be found." },
    { id:"JJ08_I04", age:8, kind:"incident", tier:1, offense:"desk_damage", caughtBias:0.18,
      hook:"{childName} comes home with ink on their hands and a casual comment about “writing on stuff” at school. The tone says they were entertained, not regretful.",
      revealCaught:"School staff connect the damage to your child and request a meeting and repair plan.",
      revealNotCaught:"No one has pinned it on anyone yet. Your child’s confidence suggests they think they’re safe." },
    { id:"JJ08_I05", age:8, kind:"incident", tier:2, offense:"construction_trespass", caughtBias:0.14,
      hook:"{childName} talks about sneaking into a fenced-off area “to explore.” Their eyes light up like it was an adventure, not trespassing.",
      revealCaught:"A security guard contacted families after seeing kids inside. Your child’s name is mentioned.",
      revealNotCaught:"No one has called. But your child describes it with too much detail to be imaginary." },
    { id:"JJ08_I06", age:8, kind:"incident", tier:1, offense:"took_school_supplies", caughtBias:0.10,
      hook:"New school supplies appear at home that you didn’t buy. {childName} insists the teacher handed them out, then changes the subject too fast.",
      revealCaught:"A teacher sends a note about missing supplies and asks parents to check backpacks.",
      revealNotCaught:"No one has reached out. It’s the kind of quiet theft that becomes routine." },
    { id:"JJ08_I07", age:8, kind:"incident", tier:2, offense:"opened_neighbor_delivery", caughtBias:0.12,
      hook:"You notice torn packaging in the trash that isn’t yours. {childName} claims it “showed up” and acts annoyed you care.",
      revealCaught:"A neighbor mentions a missing delivery and asks if you’ve seen anything. The timing is brutal.",
      revealNotCaught:"No neighbor has knocked yet. But the trash tells a story your child won’t." },
    { id:"JJ08_I08", age:8, kind:"incident", tier:2, offense:"mean_fake_account", caughtBias:0.05,
      hook:"You discover {childName} has been participating in a mean online joke about a classmate. They call it “just online,” like that erases harm.",
      revealCaught:"Another parent contacts the school, and the school contacts you. Screenshots make denial pointless.",
      revealNotCaught:"No adults have intervened yet. Your child’s laughter suggests they’re not worried." },
    { id:"JJ08_I09", age:8, kind:"incident", tier:1, offense:"skipped_small_payment", caughtBias:0.10,
      hook:"{childName} jokes about getting something “for free” when it wasn’t free. Their tone is proud, like beating a system makes them smart.",
      revealCaught:"A staff member notices and quietly reports it. It’s a warning with consequences attached.",
      revealNotCaught:"No one has noticed yet. Your child’s confidence grows in the silence." },
    { id:"JJ08_I10", age:8, kind:"incident", tier:2, offense:"fundraiser_envelope_light", caughtBias:0.06,
      hook:"A fundraiser envelope comes home lighter than expected. {childName} claims it must have been like that already and gets strangely defensive.",
      revealCaught:"The school reports missing funds and starts asking families to verify amounts. It becomes an adult issue fast.",
      revealNotCaught:"No one has accused anyone yet. You’re holding the only clue: the envelope and your child’s behavior." },
    { id:"JJ08_I11", age:8, kind:"incident", tier:1, offense:"borrow_forever", caughtBias:0.03,
      hook:"A pattern forms: {childName} comes home with “borrowed” items and never returns them unless asked. The line between borrowing and taking disappears.",
      revealCaught:"A teacher contacts you about repeated missing items connected to your child’s desk area.",
      revealNotCaught:"No one has formally complained, but friendships are starting to strain." },
    { id:"JJ08_I12", age:8, kind:"incident", tier:2, offense:"took_found_phone", caughtBias:0.15,
      hook:"A phone that isn’t yours ends up at home. {childName} says, “It was just lying there.” They don’t mention turning it in.",
      revealCaught:"The owner tracks it and contacts nearby families. Your house becomes part of the search.",
      revealNotCaught:"No one has tracked it yet. Your child’s calmness is the worrying part." },
    { id:"JJ08_I13", age:8, kind:"incident", tier:1, offense:"snack_tax", caughtBias:0.08,
      hook:"You overhear {childName} describing a “snack tax” they charge other kids for access to games or seats. They talk like a tiny boss, not a friend.",
      revealCaught:"A teacher reports another child felt threatened and pressured. Adults are watching your child’s social behavior.",
      revealNotCaught:"No adult has called, but your child’s confidence suggests it’s been happening." },
    { id:"JJ08_I14", age:8, kind:"incident", tier:2, offense:"repeat_small_scheme", caughtBias:0.06,
      hook:"You find a little notebook of “who owes what” that {childName} keeps. It reads like a tiny business—except the tone feels more like control than trade.",
      revealCaught:"Another parent complains that your child pressured theirs for money or items. The pattern becomes visible.",
      revealNotCaught:"No one has complained directly. But your child’s system is already in place." }
  ],
  10: [
    { id:"JJ10_T01", age:10, kind:"temptation", tier:0, offense:"tempt_movie_skip", caughtBias:0.00,
      hook:"{childName} talks excitedly about a plan kids are whispering about—getting into a movie without paying. They ask, “If nobody stops you, is it even wrong?” They’re watching for your answer to become their rule.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ10_T02", age:10, kind:"temptation", tier:0, offense:"tempt_password_guess", caughtBias:0.00,
      hook:"{childName} asks, almost academically, “If you guess someone’s password… that’s not like breaking anything, right?” The curiosity is sharp, like a blade they’re testing with their thumb.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ10_T03", age:10, kind:"temptation", tier:0, offense:"tempt_trade_card_hustle", caughtBias:0.00,
      hook:"{childName} says they could “make money” at school if they controlled trades and decided what things are worth. The idea sounds less like business and more like domination.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ10_T04", age:10, kind:"temptation", tier:0, offense:"tempt_fake_receipt", caughtBias:0.00,
      hook:"{childName} asks if receipts can be “reused.” They say it’s for “a joke,” but they ask too many follow-up questions for it to be harmless.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ10_T05", age:10, kind:"temptation", tier:0, offense:"tempt_fare_skip", caughtBias:0.00,
      hook:"At a bus stop, {childName} laughs about how easy it would be to ride without paying. They call it “winning.” They’re testing whether you treat it as a joke or a line.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ10_T06", age:10, kind:"temptation", tier:0, offense:"tempt_cheat_test", caughtBias:0.00,
      hook:"{childName} says, “If I can look up answers faster than anyone else, isn’t that just being smart?” It’s a question about fairness disguised as confidence.", revealCaught:"", revealNotCaught:"" },

    { id:"JJ10_I01", age:10, kind:"incident", tier:2, offense:"mall_kiosk_theft", caughtBias:0.16,
      hook:"A small item from a mall kiosk appears with {childName}. They describe it like a “challenge” kids dared each other into, as if that makes it less real.",
      revealCaught:"Mall staff intervene and contact you. It’s a warning, but it’s the kind of warning that sticks to a name.",
      revealNotCaught:"No one stops them at the mall. The only consequence so far is how proud they look telling the story." },
    { id:"JJ10_I02", age:10, kind:"incident", tier:2, offense:"borrowed_bike", caughtBias:0.12,
      hook:"{childName} comes home out of breath, talking about riding a bike that wasn’t theirs. They call it “borrowing,” but they didn’t ask permission—and they know it.",
      revealCaught:"A neighbor identifies your child and demands the bike returned and the behavior addressed.",
      revealNotCaught:"No one has confronted them yet, but the story is too specific to be pretend." },
    { id:"JJ10_I03", age:10, kind:"incident", tier:2, offense:"locker_item_taken", caughtBias:0.14,
      hook:"Something belonging to another student ends up in {childName}’s locker. {childName} insists they were “holding it” like that’s a normal thing to do.",
      revealCaught:"School staff trace the missing item and contact you. They’re treating it as theft, not confusion.",
      revealNotCaught:"The owner hasn’t found it yet. Your child is acting unusually calm—like they expect to get away with it." },
    { id:"JJ10_I04", age:10, kind:"incident", tier:1, offense:"fare_evasion", caughtBias:0.18,
      hook:"{childName} jokes about riding without paying and seems too familiar with the feeling of getting away with it. When questioned, they shrug like rules are optional.",
      revealCaught:"A transit worker reports it and asks for a parent to address it. It’s official enough to sting.",
      revealNotCaught:"No one challenges them. The silence becomes proof in their mind that it was fine." },
    { id:"JJ10_I05", age:10, kind:"incident", tier:1, offense:"cheating_test", caughtBias:0.12,
      hook:"{childName} brags about “beating a test” by using information they weren’t supposed to use. They frame it as intelligence, not dishonesty.",
      revealCaught:"The teacher notices the pattern and contacts you. {childName} is assigned consequences and loses trust.",
      revealNotCaught:"No one catches it. Your child’s confidence rises in a way that isn’t healthy." },
    { id:"JJ10_I06", age:10, kind:"incident", tier:2, offense:"took_parent_money", caughtBias:0.06,
      hook:"You notice money missing at home. Later, {childName} suddenly has snacks or items that don’t match their allowance. They insist it’s coincidence with a straight face.",
      revealCaught:"You find the missing bills tucked away. There’s no arguing with the evidence.",
      revealNotCaught:"You don’t find the money. You only find the behavior: evasive, defensive, practiced." },
    { id:"JJ10_I07", age:10, kind:"incident", tier:2, offense:"online_purchase", caughtBias:0.08,
      hook:"A digital purchase appears that you didn’t approve. {childName} insists it was “free,” then dodges every follow-up question.",
      revealCaught:"The purchase confirmation makes the timeline obvious. It’s accountability time.",
      revealNotCaught:"No one externally flags it. But the receipt sits in your inbox like a quiet accusation." },
    { id:"JJ10_I08", age:10, kind:"incident", tier:2, offense:"park_vandalism", caughtBias:0.18,
      hook:"{childName} comes home with paint/marker stains and a story that sounds like chaos. It doesn’t matter if they call it a prank—someone has to clean it up.",
      revealCaught:"Community staff identify a group of kids and contact families. Your child’s name is included.",
      revealNotCaught:"No one traces it back yet. Your child talks like being invisible makes it harmless." },
    { id:"JJ10_I09", age:10, kind:"incident", tier:2, offense:"class_trip_money_missing", caughtBias:0.10,
      hook:"Money for a class activity goes missing and {childName} has sudden “extra.” They seem annoyed that adults care about something “so small.”",
      revealCaught:"The school begins asking questions. Teachers check bags and stories start falling apart.",
      revealNotCaught:"No one has pinned it down yet. But your child’s mood shifts whenever the topic comes up." },
    { id:"JJ10_I10", age:10, kind:"incident", tier:3, offense:"small_scam_school", caughtBias:0.08,
      hook:"{childName} runs a little “deal” at school—collecting money or items from kids with promises that don’t match what they deliver. They call it business.",
      revealCaught:"A parent complains to the school about money taken. Adults are investigating patterns and names.",
      revealNotCaught:"No adult has stepped in yet. Your child is getting comfortable taking advantage of trust." },
    { id:"JJ10_I11", age:10, kind:"incident", tier:2, offense:"donation_box_dip", caughtBias:0.12,
      hook:"You hear that small amounts keep disappearing from donation jars. {childName} reacts oddly—too interested, too quick to joke, too eager to change the topic.",
      revealCaught:"Someone checks cameras or witnesses and families are contacted. It becomes a real conversation about theft.",
      revealNotCaught:"No proof appears yet. But your child’s reaction makes the suspicion hard to ignore." },
    { id:"JJ10_I12", age:10, kind:"incident", tier:2, offense:"resale_items_suspicious", caughtBias:0.05,
      hook:"{childName} talks about selling “extra” items online. When asked where they got the items, they give vague answers and act offended you asked.",
      revealCaught:"A buyer or another parent raises concerns, and you get pulled into the mess.",
      revealNotCaught:"Nothing external happens. That quiet success teaches the wrong lesson." },
    { id:"JJ10_I13", age:10, kind:"incident", tier:2, offense:"trespass_backyard", caughtBias:0.10,
      hook:"A neighbor mentions kids have been sneaking into yards to use things when people aren’t home. {childName} comes home with grass stains and a too-casual smile.",
      revealCaught:"The neighbor identifies the kids involved and calls you directly. They want it to stop immediately.",
      revealNotCaught:"No one has accused anyone yet. Your child’s confidence says they think it’s safe." },
    { id:"JJ10_I14", age:10, kind:"incident", tier:3, offense:"unauthorized_account_access", caughtBias:0.14,
      hook:"{childName} admits they got into something they weren’t supposed to—someone else’s account or school system access—just to see if they could. They talk about it like a puzzle.",
      revealCaught:"School IT notices unusual activity and contacts you. They’re taking it seriously.",
      revealNotCaught:"No one notices yet. Your child’s excitement is the biggest red flag." }
  ],
  12: [
    { id:"JJ12_T01", age:12, kind:"temptation", tier:0, offense:"tempt_abandoned_building", caughtBias:0.00,
      hook:"{childName} talks about exploring an abandoned place with friends. They call it “just exploring,” but you can hear the thrill of crossing a line they know exists.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ12_T02", age:12, kind:"temptation", tier:0, offense:"tempt_mall_challenge", caughtBias:0.00,
      hook:"{childName} mentions a mall “challenge” where kids try to take something small and brag about it. They ask, “If it’s tiny, why do adults freak out?”", revealCaught:"", revealNotCaught:"" },
    { id:"JJ12_T03", age:12, kind:"temptation", tier:0, offense:"tempt_online_alt", caughtBias:0.00,
      hook:"{childName} asks if they’re allowed to have a second account online “for fun.” The way they say it makes it sound like they want a mask.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ12_T04", age:12, kind:"temptation", tier:0, offense:"tempt_take_package", caughtBias:0.00,
      hook:"Walking past porches, {childName} comments, “People just leave boxes out. That’s wild.” It’s a statement that sounds like admiration, not surprise.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ12_T05", age:12, kind:"temptation", tier:0, offense:"tempt_big_prank", caughtBias:0.00,
      hook:"{childName} describes a prank idea that would create real damage. They keep using the word “prank” like it’s a magic shield.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ12_T06", age:12, kind:"temptation", tier:0, offense:"tempt_loophole_law", caughtBias:0.00,
      hook:"{childName} asks, “Is something illegal if it’s online?” They’re not asking for rules—they’re asking for loopholes.", revealCaught:"", revealNotCaught:"" },

    { id:"JJ12_I01", age:12, kind:"incident", tier:2, offense:"mall_shoplift", caughtBias:0.16,
      hook:"{childName} comes home tense and energetic, like they’re buzzing. An item appears that doesn’t match what you bought. Their story is rehearsed, like a script.",
      revealCaught:"Mall security identifies the kids involved and contacts families. It becomes official fast.",
      revealNotCaught:"No one stops them. The quiet success feeds the idea that rules don’t apply." },
    { id:"JJ12_I02", age:12, kind:"incident", tier:3, offense:"fundraiser_cash_box", caughtBias:0.14,
      hook:"Money goes missing from a school fundraiser setup. {childName} reacts strangely when you mention it—defensive, amused, or oddly calm. The vibe is wrong.",
      revealCaught:"The school starts investigating. Adults are asking who was near the box and when.",
      revealNotCaught:"No one has proof yet. But your child’s reaction suggests they know more than they’re saying." },
    { id:"JJ12_I03", age:12, kind:"incident", tier:3, offense:"trespass_restricted_area", caughtBias:0.12,
      hook:"{childName} tells a story about getting into a place clearly marked off-limits. They call it adventure. You hear it as rehearsal for bigger lines.",
      revealCaught:"An adult reports the kids and authorities issue a formal warning. Your child’s name is in the report.",
      revealNotCaught:"No one reports it. Your child keeps retelling it like it’s a victory." },
    { id:"JJ12_I04", age:12, kind:"incident", tier:2, offense:"online_impersonation", caughtBias:0.08,
      hook:"You discover {childName} has been impersonating someone online or using an alt account to embarrass a peer. They describe it like entertainment.",
      revealCaught:"Screenshots circulate and parents contact the school. It stops being “just online.”",
      revealNotCaught:"No adult intervenes yet. Your child becomes bolder behind the screen." },
    { id:"JJ12_I05", age:12, kind:"incident", tier:3, offense:"community_center_damage", caughtBias:0.16,
      hook:"The community center reports serious damage after a group of kids were there. {childName} insists they only “watched,” but the story keeps shifting.",
      revealCaught:"Staff identify participants and contact families. There’s a bill and a meeting.",
      revealNotCaught:"No names are confirmed yet. Your child’s evasiveness speaks volumes." },
    { id:"JJ12_I06", age:12, kind:"incident", tier:3, offense:"joyride_attempt", caughtBias:0.18,
      hook:"You hear rumors of kids getting into cars they shouldn’t. {childName} comes home with adrenaline in their voice and a grin that doesn’t belong to a normal day.",
      revealCaught:"An adult reports it immediately. Authorities take it seriously even if no one was hurt.",
      revealNotCaught:"No one catches them this time. The thrill becomes a hook." },
    { id:"JJ12_I07", age:12, kind:"incident", tier:2, offense:"stolen_merch", caughtBias:0.06,
      hook:"{childName} suddenly has brand-name merch that doesn’t match their budget. They say it was a gift, but won’t say from whom.",
      revealCaught:"Someone recognizes the item as stolen and the story reaches adults. Questions land hard.",
      revealNotCaught:"No one challenges it. Your child learns they can upgrade their life without earning it." },
    { id:"JJ12_I08", age:12, kind:"incident", tier:2, offense:"package_theft_suspicion", caughtBias:0.14,
      hook:"A neighbor complains about missing packages. Later, you notice torn shipping material in your trash. {childName} shrugs like it’s nothing.",
      revealCaught:"Footage or witnesses point toward your child. The neighbor confronts you with evidence.",
      revealNotCaught:"No one has proof. You’re left with the trash and your child’s too-calm attitude." },
    { id:"JJ12_I09", age:12, kind:"incident", tier:2, offense:"stolen_accessory", caughtBias:0.08,
      hook:"An expensive accessory appears—earbuds, jewelry, gear—with no clear origin. {childName} insists it was “found.” The answer arrives too quickly.",
      revealCaught:"The owner searches and the trail points to your child. It becomes a confrontation.",
      revealNotCaught:"No one claims it yet. Your child’s confidence rises in the quiet." },
    { id:"JJ12_I10", age:12, kind:"incident", tier:3, offense:"harassment_alt_account", caughtBias:0.06,
      hook:"You find messages showing {childName} participating in targeted harassment. They speak about it like social power, not cruelty.",
      revealCaught:"Screenshots circulate and the school gets involved. Consequences follow.",
      revealNotCaught:"No adult intervenes yet. The harm continues because it’s “easy.”" },
    { id:"JJ12_I11", age:12, kind:"incident", tier:2, offense:"theft_friend_item", caughtBias:0.10,
      hook:"A friend’s valued item goes missing after a hangout. Later, you spot the same item in {childName}’s space. {childName} calls it “a loan.”",
      revealCaught:"The friend’s family contacts you directly. They want it back and want answers.",
      revealNotCaught:"No one has asked yet. Your child is betting you’ll let it slide." },
    { id:"JJ12_I12", age:12, kind:"incident", tier:3, offense:"selling_stolen_goods", caughtBias:0.08,
      hook:"{childName} seems to be flipping items quickly—always new, always cash. When asked where the items come from, they act insulted and evasive.",
      revealCaught:"A buyer complains or authorities connect sales to theft reports. Your child’s name surfaces.",
      revealNotCaught:"No one connects it yet. The money becomes reinforcement." },
    { id:"JJ12_I13", age:12, kind:"incident", tier:3, offense:"school_device_missing", caughtBias:0.12,
      hook:"School-issued devices go missing around an event. Later, you notice a device bag at home that you don’t recognize. {childName} goes tense when you touch it.",
      revealCaught:"The school tracks serial numbers and contacts families. It becomes an investigation.",
      revealNotCaught:"No tracking hits your home yet. Your child’s panic suggests they know it’s serious." },
    { id:"JJ12_I14", age:12, kind:"incident", tier:3, offense:"confessed_theft", caughtBias:0.04,
      hook:"Late at night, {childName} admits they took something and didn’t get caught. They look half-proud, half-scared—waiting to see which emotion you feed.",
      revealCaught:"The next day, someone notices and adults start asking questions. The window of secrecy closes quickly.",
      revealNotCaught:"No one has noticed yet. Your child is watching whether you become a boundary—or an accomplice." }
  ],
  14: [
    { id:"JJ14_T01", age:14, kind:"temptation", tier:0, offense:"tempt_crew_offer", caughtBias:0.00,
      hook:"{childName} mentions a group offering “easy money” after school. They won’t say details—just watch your reaction with a half-smile, like your values are entertainment.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ14_T02", age:14, kind:"temptation", tier:0, offense:"tempt_resale_loophole", caughtBias:0.00,
      hook:"{childName} asks, “If I sell stuff online and don’t say where it came from, is that illegal?” They’re not asking about ethics—they’re asking about risk.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ14_T03", age:14, kind:"temptation", tier:0, offense:"tempt_after_hours", caughtBias:0.00,
      hook:"{childName} jokes about being inside places after they close, like it’s a flex. They talk about boundaries the way some kids talk about dares.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ14_T04", age:14, kind:"temptation", tier:0, offense:"tempt_fake_identity", caughtBias:0.00,
      hook:"{childName} asks about fake names online. “Everybody does it,” they say. The casualness suggests they already have a mask ready.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ14_T05", age:14, kind:"temptation", tier:0, offense:"tempt_higher_value_theft", caughtBias:0.00,
      hook:"{childName} says, “It’s not worth it if it’s small.” They’re testing whether you’ll challenge the direction that sentence points.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ14_T06", age:14, kind:"temptation", tier:0, offense:"tempt_rule_of_fear", caughtBias:0.00,
      hook:"{childName} says, “People only care about rules when they’re scared.” They’re not entirely wrong—and that’s what makes it dangerous.", revealCaught:"", revealNotCaught:"" },

    { id:"JJ14_I01", age:14, kind:"incident", tier:2, offense:"porch_package_taken", caughtBias:0.16,
      hook:"A neighbor’s package goes missing and {childName} shows up with something new they won’t explain. Their confidence feels rehearsed.",
      revealCaught:"There’s video or a clear witness, and the neighbor confronts you with evidence. It’s not rumor anymore.",
      revealNotCaught:"No one has evidence. But your child’s sudden new item and attitude make the situation obvious to you." },
    { id:"JJ14_I02", age:14, kind:"incident", tier:3, offense:"high_value_shoplift", caughtBias:0.18,
      hook:"{childName} is connected to an attempt to take a high-value item from a store. They talk about it like it was strategy, not theft.",
      revealCaught:"Store security intervenes and paperwork appears. Adults treat it as serious because it is.",
      revealNotCaught:"No one stops them. That success hardens the belief they’re untouchable." },
    { id:"JJ14_I03", age:14, kind:"incident", tier:3, offense:"car_break_in_association", caughtBias:0.14,
      hook:"You hear that a car in the area was broken into and a group of teens was involved. {childName} comes home defensive, acting insulted that anyone would suspect them.",
      revealCaught:"Authorities contact families connected to the group. Your child is questioned and the tone is not friendly.",
      revealNotCaught:"No one pins it down yet. But your child’s reaction feels like knowledge, not innocence." },
    { id:"JJ14_I04", age:14, kind:"incident", tier:4, offense:"after_hours_entry_school", caughtBias:0.18,
      hook:"There’s a report of teens inside the school building after hours without permission. {childName} avoids your eyes and talks like it was “no big deal.”",
      revealCaught:"Security or staff catch the group. It’s treated as unlawful entry, not a prank.",
      revealNotCaught:"No one catches them this time. The thrill becomes a blueprint in their mind." },
    { id:"JJ14_I05", age:14, kind:"incident", tier:3, offense:"account_misuse_orders", caughtBias:0.12,
      hook:"Another family reports suspicious orders tied to their account and traces it toward your child’s circle. {childName} insists, “It’s not like anyone got hurt.”",
      revealCaught:"Evidence piles up quickly and adults contact you. Your child’s denial collapses under specifics.",
      revealNotCaught:"No one has traced it fully yet. Your child acts like that means it wasn’t wrong." },
    { id:"JJ14_I06", age:14, kind:"incident", tier:3, offense:"city_vandalism_bill", caughtBias:0.16,
      hook:"A public space is vandalized with real cleanup cost. {childName} is unusually energized, like chaos feels powerful.",
      revealCaught:"Authorities identify the group and send notices to families. There’s a bill and consequences.",
      revealNotCaught:"No one identifies anyone yet. Your child’s pride is the most alarming evidence." },
    { id:"JJ14_I07", age:14, kind:"incident", tier:3, offense:"stolen_items_in_bag", caughtBias:0.14,
      hook:"Stolen items are suspected in your child’s friend group, and {childName} is suddenly protective of their backpack and personal space.",
      revealCaught:"A school sweep or adult check finds items. Your child is directly implicated.",
      revealNotCaught:"No one searches bags. Your child’s secrecy becomes the only clue you have." },
    { id:"JJ14_I08", age:14, kind:"incident", tier:2, offense:"closed_business_trespass", caughtBias:0.14,
      hook:"{childName} is spotted behind a closed business late. They claim they were “just hanging out,” like that erases boundaries.",
      revealCaught:"Police or security intervene and contact families. It becomes formal.",
      revealNotCaught:"No one confronts them. The confidence builds in the dark." },
    { id:"JJ14_I09", age:14, kind:"incident", tier:3, offense:"resale_account_fake_name", caughtBias:0.08,
      hook:"You find your child running a resale account under a fake name. The inventory looks too new, too random, too convenient to be innocent.",
      revealCaught:"A buyer complains or authorities trace listings connected to theft reports. The account becomes evidence.",
      revealNotCaught:"No one connects the dots. Your child calls it “business” and expects you to accept it." },
    { id:"JJ14_I10", age:14, kind:"incident", tier:2, offense:"keys_missing_suspicion", caughtBias:0.06,
      hook:"Your spare keys go missing for a short time and then reappear. {childName} is strangely tense when you mention it—like the topic is dangerous.",
      revealCaught:"A neighbor reports an attempted entry and questions point uncomfortably close to your home.",
      revealNotCaught:"No one reports anything. But your child’s mood tells you the keys mattered." },
    { id:"JJ14_I11", age:14, kind:"incident", tier:3, offense:"school_devices_in_closet", caughtBias:0.12,
      hook:"A device bag shows up in {childName}’s closet that you don’t recognize. They act offended that you looked, which is its own answer.",
      revealCaught:"The school tracks devices and contacts families. Your household is pulled into an investigation.",
      revealNotCaught:"No one tracks it to you yet. Your child is betting you’ll stop asking questions." },
    { id:"JJ14_I12", age:14, kind:"incident", tier:2, offense:"sudden_cash_new_clothes", caughtBias:0.06,
      hook:"{childName} suddenly has new clothes and extra cash. They claim they “sold things,” but won’t show what they sold or to whom.",
      revealCaught:"Someone recognizes the item as stolen and the story reaches adults. Questions land hard.",
      revealNotCaught:"No one challenges it. Money becomes the reward for secrecy." },
    { id:"JJ14_I13", age:14, kind:"incident", tier:3, offense:"unopened_boxes_match_thefts", caughtBias:0.10,
      hook:"You find unopened product boxes that match brands neighbors recently complained about being stolen. {childName} calls you “weird” for caring.",
      revealCaught:"Neighbors share evidence and reports connect. Your child’s stash becomes impossible to ignore.",
      revealNotCaught:"No one has proof. But you’re holding the moral center of the story now." },
    { id:"JJ14_I14", age:14, kind:"incident", tier:4, offense:"repeat_serious_property_crime", caughtBias:0.12,
      hook:"It’s not one incident anymore. It’s a pattern of serious property offenses—your child acting like consequences are for other people.",
      revealCaught:"Authorities contact you with a case file tone. This is the moment the system steps in.",
      revealNotCaught:"No one has “caught” them cleanly yet—but the attention is closing in. You can feel it in the neighborhood talk." }
  ],
  16: [
    { id:"JJ16_T01", age:16, kind:"temptation", tier:0, offense:"tempt_unlawful_entry", caughtBias:0.00,
      hook:"{childName} talks about getting into “empty places” at night like it’s a puzzle. They’re not asking if it’s wrong—they’re asking if it’s worth it.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ16_T02", age:16, kind:"temptation", tier:0, offense:"tempt_big_money", caughtBias:0.00,
      hook:"{childName} hints at a chance to make “real money.” They watch your face and say, “Being good is expensive.” It’s a line that sounds practiced.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ16_T03", age:16, kind:"temptation", tier:0, offense:"tempt_scam_people", caughtBias:0.00,
      hook:"{childName} jokes about how easy it is to trick strangers online. They call it “their fault for believing it.” The lack of empathy is the point.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ16_T04", age:16, kind:"temptation", tier:0, offense:"tempt_fake_ids", caughtBias:0.00,
      hook:"{childName} mentions fake IDs like they’re a normal teen accessory. They say, “Everyone wants access.” The implication is that they can provide it.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ16_T05", age:16, kind:"temptation", tier:0, offense:"tempt_bigger_vandalism", caughtBias:0.00,
      hook:"{childName} talks about making a “statement” with vandalism, framing it as art or rebellion. They want power and attention, not expression.", revealCaught:"", revealNotCaught:"" },
    { id:"JJ16_T06", age:16, kind:"temptation", tier:0, offense:"tempt_rule_contempt", caughtBias:0.00,
      hook:"{childName} says, “Rules aren’t real. People are.” It’s the kind of philosophy that can justify anything if you let it.", revealCaught:"", revealNotCaught:"" },

    { id:"JJ16_I01", age:16, kind:"incident", tier:4, offense:"breaking_and_entering", caughtBias:0.18,
      hook:"There’s an allegation that {childName} was inside a property they had no permission to enter. {childName} looks at you like you’re either their shield or their judge.",
      revealCaught:"Authorities intervene quickly. This is treated as serious unlawful entry, not teen mischief.",
      revealNotCaught:"No one has proof yet, but the rumor is loud. Attention begins to circle your child like a spotlight." },
    { id:"JJ16_I02", age:16, kind:"incident", tier:4, offense:"stolen_vehicle_association", caughtBias:0.16,
      hook:"{childName} is tied to a vehicle reported stolen—whether as driver or passenger in the wrong place at the wrong time. They insist they were “just there.”",
      revealCaught:"Police contact you with paperwork energy. The consequences are heavy even without violence.",
      revealNotCaught:"No one confirms anything yet, but the story spreads. Your child’s circle is being watched." },
    { id:"JJ16_I03", age:16, kind:"incident", tier:3, offense:"organized_shoplifting", caughtBias:0.16,
      hook:"It’s not a single stolen item anymore. It’s a pattern connected to a group—planned, repeated, normalized. {childName} calls it “everyone does it.”",
      revealCaught:"A store investigator identifies repeat patterns and contacts families. It’s not a slap on the wrist.",
      revealNotCaught:"No one confronts them yet. The successful pattern hardens into identity." },
    { id:"JJ16_I04", age:16, kind:"incident", tier:3, offense:"school_theft_after_hours", caughtBias:0.14,
      hook:"Equipment goes missing around school after-hours access. {childName} gets defensive when you ask where they were. The defensiveness answers the question for you.",
      revealCaught:"Security footage or staff reports tie the event to your child’s group. Authorities get involved.",
      revealNotCaught:"No one has footage. But whispers about “who did it” start circling your child’s name." },
    { id:"JJ16_I05", age:16, kind:"incident", tier:3, offense:"marketplace_scam", caughtBias:0.10,
      hook:"You learn {childName} has been using deception to take money through an online marketplace. They dismiss victims as “stupid,” like empathy is optional.",
      revealCaught:"A victim reports it and the trail leads toward your child’s account or device. It becomes official.",
      revealNotCaught:"No one reports it yet. The money feels like proof to your child that it worked." },
    { id:"JJ16_I06", age:16, kind:"incident", tier:3, offense:"major_vandalism", caughtBias:0.18,
      hook:"Serious vandalism occurs—expensive cleanup, public anger. {childName} talks about it like a story worth telling, not a harm worth repairing.",
      revealCaught:"Authorities identify the group and contact you. There’s no gentle version of this.",
      revealNotCaught:"No one identifies anyone yet. But the community is angry, and attention is building." },
    { id:"JJ16_I07", age:16, kind:"incident", tier:4, offense:"stolen_goods_found_home", caughtBias:0.12,
      hook:"You find stolen goods at home—items that clearly don’t belong to your family. {childName} reacts with anger that you looked, not shame that it’s there.",
      revealCaught:"Authorities arrive or contact you after reports connect. The presence of items becomes evidence.",
      revealNotCaught:"No one has arrived yet. But the stash makes the situation feel like it’s already too big." },
    { id:"JJ16_I08", age:16, kind:"incident", tier:3, offense:"fake_id_stack", caughtBias:0.08,
      hook:"You discover fake IDs or credentials meant to get access to places or perks. {childName} laughs and calls it “just paper.”",
      revealCaught:"An adult or authority figure finds out and treats it as fraud-related misconduct.",
      revealNotCaught:"No one has noticed yet. Your child acts like that means it’s harmless." },
    { id:"JJ16_I09", age:16, kind:"incident", tier:3, offense:"late_night_yard_runs", caughtBias:0.12,
      hook:"Neighbors complain about teens running through yards at night and taking small items left outside. {childName} comes home dirty, energized, and evasive.",
      revealCaught:"A neighbor identifies your child and calls you directly. The neighborhood is done being patient.",
      revealNotCaught:"No one identifies anyone. Your child’s grin suggests they think they’re invisible." },
    { id:"JJ16_I10", age:16, kind:"incident", tier:2, offense:"trespass_alarm_response", caughtBias:0.18,
      hook:"{childName} ends up in a closed venue after hours and it triggers an alarm response. They call it “fun.” Adults call it trespassing.",
      revealCaught:"Police or security respond and contact families. It’s official and embarrassing.",
      revealNotCaught:"No one responds in time. Your child treats that as proof they’re smarter than the system." },
    { id:"JJ16_I11", age:16, kind:"incident", tier:2, offense:"sudden_phone_upgrade", caughtBias:0.06,
      hook:"{childName} suddenly upgrades their phone without asking you for money. They claim “sales,” but refuse to show receipts or details.",
      revealCaught:"Someone recognizes the device or reports suspicious sales and your child is questioned.",
      revealNotCaught:"No one challenges it. Your child learns lifestyle upgrades can come from lies." },
    { id:"JJ16_I12", age:16, kind:"incident", tier:3, offense:"burner_resale_hot_items", caughtBias:0.08,
      hook:"You discover a burner resale account moving items quickly—always urgent, always anonymous. {childName} insists it’s “hustle,” not harm.",
      revealCaught:"Authorities connect listings to theft reports and trace the account. The anonymity fails.",
      revealNotCaught:"No one connects it yet. The hustle becomes identity." },
    { id:"JJ16_I13", age:16, kind:"incident", tier:3, offense:"unopened_packages_trunk", caughtBias:0.10,
      hook:"Unopened packages with other addresses appear in {childName}’s car or room. They snap, “Don’t touch that,” like secrecy is a right.",
      revealCaught:"Reports of missing packages connect and attention lands on your child. Confrontation becomes unavoidable.",
      revealNotCaught:"No one has traced them yet. But the evidence is already sitting in your house." },
    { id:"JJ16_I14", age:16, kind:"incident", tier:4, offense:"repeat_serious_offenses", caughtBias:0.12,
      hook:"The pattern has escalated: repeated serious offenses, growing boldness, shrinking remorse. {childName} talks like consequences are for people who get caught.",
      revealCaught:"The system steps in. This is the kind of moment that leads to juvenile hall.",
      revealNotCaught:"They aren’t caught today—but the attention is closing in. Heat rises even without paperwork." }
  ]
};

const DIVERSION_SCENARIOS = [
  { id:"DV01", kind:"diversion", hook:"Diversion starts with a calendar, a counselor, and a list of rules that reads like a terms‑and‑conditions update. {childName} calls it “stupid.” Their jaw says “scared.”" },
  { id:"DV02", kind:"diversion", hook:"The counselor is blunt: take this seriously or the system gets louder. {childName} smirks: “What happens if I don’t?” (They’re watching if you flinch.)" },
  { id:"DV03", kind:"diversion", hook:"A peer finds out about diversion and turns it into a joke. {childName} comes home heated, desperate to prove they’re still ‘tough.’ This is an identity fork in the road." },
  { id:"DV04", kind:"diversion", hook:"Community service goes surprisingly well… until {childName} torpedoes the moment with sarcasm. You can see pride fighting shame in real time." },
  { id:"DV05", kind:"diversion", hook:"Diversion review meeting. Adults are deciding: growth or compliance? {childName} looks at you like your words can tip the scale." },
  { id:"DV06", kind:"diversion", hook:"{childName} admits they felt a flicker of guilt today — then tries to laugh it off. “It was nothing.” (It wasn’t nothing.)" },
  { id:"DV07", kind:"diversion", hook:"A friend dares {childName} to break curfew. {childName} asks what you’d do if they simply didn’t come home on time — casual tone, serious test." },
  { id:"DV08", kind:"diversion", hook:"Diversion is almost over. {childName} asks, “So after this… I’m free, right?” They want ‘free’ to mean ‘untouchable.’" }
];

const HALL_SCENARIOS_BY_YEAR = {
  1: [
    { id:"JH1_01", kind:"hall", hook:"Intake day. Fluorescent lights, paperwork, inventory of belongings. {childName} tries to act tough, but their voice cracks when they ask if you’ll still show up." },
    { id:"JH1_02", kind:"hall", hook:"Juvenile hall school starts. {childName} calls it “fake school” and refuses to participate. Staff ask if you can push them toward the program track." },
    { id:"JH1_03", kind:"hall", hook:"{childName} mentions a group inside offering protection—if you stick with them. It sounds like crew-building behind locked doors. " },
    { id:"JH1_04", kind:"hall", hook:"First visitation. {childName} is cold and sarcastic, testing whether you’ll still love them while holding boundaries. The guard says this is normal. " },
    { id:"JH1_05", kind:"hall", hook:"A counselor offers a restorative option—hearing impact, writing repair letters, confronting harm without humiliation. {childName} calls it “cringe” but keeps listening. " },
    { id:"JH1_06", kind:"hall", hook:"{childName} gets written up for a non-violent rule violation—defiant, impulsive, avoidable. They call you furious and want you to fight staff. " },
    { id:"JH1_07", kind:"hall", hook:"A staff member says {childName} shows leadership energy—right now it’s pointed in the wrong direction. They ask what kind of leader you want your child to become. " },
    { id:"JH1_08", kind:"hall", hook:"{childName} admits, quietly, that hall feels scarier at night. Then they snap back into attitude like vulnerability is dangerous. " }
  ],
  2: [
    { id:"JH2_01", kind:"hall", hook:"Hall year two. {childName} can choose a track: GED prep, vocational shop, therapy group. They shrug: “It doesn’t matter.” It does. " },
    { id:"JH2_02", kind:"hall", hook:"A mentor says {childName} works hard when they’re respected—but collapses into defiance when they feel judged. That pattern started at home too. " },
    { id:"JH2_03", kind:"hall", hook:"{childName} receives a letter from an old friend still living the crime-spree fantasy. {childName} asks if they can write back. " },
    { id:"JH2_04", kind:"hall", hook:"Family therapy is offered. {childName} refuses, then says: “Maybe… if you don’t make it humiliating.” It’s a door cracked open. " },
    { id:"JH2_05", kind:"hall", hook:"{childName} asks you to bring something you’re not allowed to bring during visitation—testing loyalty against rules. This is a character test for both of you. " },
    { id:"JH2_06", kind:"hall", hook:"Progress review hearing. Staff ask about growth, accountability, and support at home. {childName} watches your face like you can rewrite their story. " },
    { id:"JH2_07", kind:"hall", hook:"{childName} admits they like the respect they get for being ‘hard.’ They don’t realize it’s a trap. " },
    { id:"JH2_08", kind:"hall", hook:"A small achievement happens—passed a test, learned a skill, completed a program. {childName} pretends it doesn’t matter, then mentions it again later. " }
  ],
  3: [
    { id:"JH3_01", kind:"hall", hook:"Staff offer {childName} a peer-leader role in class—but only if they keep behavior consistent. {childName} scoffs, then hesitates. " },
    { id:"JH3_02", kind:"hall", hook:"{childName} says, “I’m smarter than most people here. I’m just unlucky.” It’s blame dressed as ego. " },
    { id:"JH3_03", kind:"hall", hook:"A restorative circle is offered. {childName} calls it pointless, but you hear fear under the sarcasm: fear of feeling guilt. " },
    { id:"JH3_04", kind:"hall", hook:"{childName} is caught in a rule-breaking scheme inside—non-violent, but calculated. They want you to ‘fix it.’ " },
    { id:"JH3_05", kind:"hall", hook:"Reentry planning begins: school options, job training, community supports. {childName} says, “I’ll do what I want when I’m out.” " },
    { id:"JH3_06", kind:"hall", hook:"A younger kid in hall looks up to {childName} like a role model. {childName} notices and smiles—dangerously. " },
    { id:"JH3_07", kind:"hall", hook:"{childName} has a rare quiet moment and admits they miss normal life—then immediately tries to destroy the moment with a joke. " },
    { id:"JH3_08", kind:"hall", hook:"A staff member says: “Your child can leave here with skills or with a stronger criminal identity. Both are possible.” " }
  ],
  4: [
    { id:"JH4_01", kind:"hall", hook:"Release hearing approaches. {childName} asks, almost whispering, “What if they don’t let me out?” The fear is real. " },
    { id:"JH4_02", kind:"hall", hook:"Reentry conditions are explained: curfew, attendance, check-ins. {childName} sneers: “Rules are for other people.” " },
    { id:"JH4_03", kind:"hall", hook:"There’s a small ceremony for completing a program. {childName} asks if you’ll come, then pretends they don’t care. " },
    { id:"JH4_04", kind:"hall", hook:"An old contact reaches out through a friend: “We missed you.” {childName} lights up in a way you haven’t seen in months. " },
    { id:"JH4_05", kind:"hall", hook:"Near the end, {childName} is offered an easy shortcut—break a rule for a small advantage. They say, “It’s fine. I’m leaving anyway.” " },
    { id:"JH4_06", kind:"hall", hook:"Release day. {childName} walks out carrying a small bag, older than when they went in. The world looks both theirs and unfamiliar. " },
    { id:"JH4_07", kind:"hall", hook:"A probation officer outlines expectations and asks you directly: “Do you enforce boundaries at home?” {childName} watches you like your answer is destiny. " },
    { id:"JH4_08", kind:"hall", hook:"On the final stretch, {childName} admits they don’t know who they are without the ‘hard’ persona. It’s the first honest sentence in a long time. " }
  ]
};

const PROBATION_SCENARIOS = [
  { id:"PB01", kind:"probation", hook:"Probation begins: check‑ins, conditions, and a new adult whose job is ‘follow the rules.’ {childName} calls it control. You can feel the test: will your home have structure or loopholes?" },
  { id:"PB02", kind:"probation", hook:"Curfew night. A friend texts like it’s a dare. {childName} asks what you’ll do if they stroll in late — calm voice, provocative question." },
  { id:"PB03", kind:"probation", hook:"A job or school opportunity appears, then a background question about past trouble pops up. {childName} flares with anger and shame at the same time." },
  { id:"PB04", kind:"probation", hook:"The probation officer requests a home visit. {childName} says, “Tell them I’m fine,” like looking fine is the same as being fine." },
  { id:"PB05", kind:"probation", hook:"An old crew tries to reconnect. {childName} smiles at their phone like the past is calling them by name." },
  { id:"PB06", kind:"probation", hook:"A small rule violation happens — nothing violent, but not nothing. {childName} calls it ‘no big deal.’ Your nervous system disagrees." },
  { id:"PB07", kind:"probation", hook:"{childName} does something responsible — shows up, studies, helps — then tries to ruin the moment with sarcasm, like success is embarrassing." },
  { id:"PB08", kind:"probation", hook:"Stress spikes. {childName} mutters, “It’s easier to be bad. People expect it anyway.” That’s relapse logic forming in real time." },
  { id:"PB09", kind:"probation", hook:"A community member recognizes {childName} and treats them with suspicion. {childName} explodes: “See? They’ll never forgive me.”" },
  { id:"PB10", kind:"probation", hook:"A probation check‑in goes well. The officer says your child has potential if they keep choosing stability. {childName} acts like they don’t care. They care." },
  { id:"PB11", kind:"probation", hook:"A new friend offers healthier influence. {childName} mocks it as ‘soft.’ They’re testing whether softness is allowed in your home." },
  { id:"PB12", kind:"probation", hook:"Probation nears completion. {childName} asks, “After this, am I finally free?” They want ‘free’ to mean ‘no consequences.’" }
];

export const JUVENILE_HALL_PROGRAMS = [
  { id: "ged_prep", title: "GED Prep & Testing", desc: "Basic education catch-up.", deltas: { intelligence: 0.25, discipline: 0.15 }, jj: { remorse: 4, spree: -4, heat: -2 } },
  { id: "vocational", title: "Vocational Shop", desc: "Hands-on trade skills.", deltas: { discipline: 0.25, intelligence: 0.15, confidence: 0.1 }, jj: { spree: -3 } },
  { id: "restorative", title: "Restorative Justice Circle", desc: "Confronting harm directly.", deltas: { empathy: 0.35 }, jj: { remorse: 12, crimeIdentity: -8, crew: -4, spree: -6, heat: -2 } },
  { id: "cbt_group", title: "CBT Group", desc: "Thinking patterns workshop.", deltas: { discipline: 0.25, empathy: 0.1 }, jj: { remorse: 8, spree: -5 } },
  { id: "anger_control", title: "Anger & Impulse Control", desc: "Managing reactions.", deltas: { discipline: 0.30, empathy: 0.1 }, jj: { remorse: 6, spree: -5 } },
  { id: "art_therapy", title: "Art Therapy Studio", desc: "Expression without words.", deltas: { empathy: 0.15, confidence: 0.20 }, jj: { remorse: 4, heat: -3 } },
  { id: "fitness", title: "Structured Fitness", desc: "Physical discipline.", deltas: { discipline: 0.20, confidence: 0.10 }, jj: { heat: -2, spree: -2 } },
  { id: "book_club", title: "Library Book Club", desc: "Reading and discussing.", deltas: { intelligence: 0.15, empathy: 0.1 }, jj: { remorse: 3, spree: -2 } },
  { id: "mentor", title: "Mentor Check-Ins", desc: "Guidance from someone real.", deltas: { confidence: 0.1, empathy: 0.1 }, jj: { remorse: 4, crew: -2, spree: -3 }, loveDelta: 0.2 },
  { id: "family_therapy", title: "Family Therapy Session", desc: "Hard but necessary.", deltas: { empathy: 0.1 }, jj: { remorse: 6, spree: -2 }, loveDelta: 0.8, stressDelta: 0.3 },
  { id: "reentry", title: "Reentry Plan Workshop", desc: "Preparing for release.", deltas: { discipline: 0.25, confidence: 0.1 }, jj: { remorse: 4, spree: -4, crew: -2 } },
  { id: "debate", title: "Debate & Rhetoric", desc: "Using words as power.", deltas: { confidence: 0.20, intelligence: 0.1 }, jj: { crimeIdentity: 2, remorse: -2 } }
];

// --- HELPERS ---

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function clamp01(num) {
  return clamp(num, 0, 1);
}

function getNearestJJPoolAgeKey(age) {
  const keys = [6, 8, 10, 12, 14, 16];
  if (age <= 6) return 6;
  if (age >= 16) return 16;
  // nearest lower-or-equal key
  for (let i = keys.length - 1; i >= 0; i--) {
    if (age >= keys[i]) return keys[i];
  }
  return 6;
}

export function computeJJRiskScore(gameState) {
  const stats = gameState?.stats || {};
  const jj = gameState?.juvenileJustice || {};

  const lowEmp = clamp01((5 - (stats.empathy || 0)) / 15);
  const lowDis = clamp01((5 - (stats.discipline || 0)) / 15);
  const hiCon = clamp01(((stats.confidence || 0) - 8) / 20);

  const spreeF = clamp01((jj.spree || 0) / 100);
  const crewF = clamp01((jj.crew || 0) / 100);
  const idF = clamp01((jj.crimeIdentity || 0) / 100);
  const remorseF = clamp01((jj.remorse || 50) / 100);

  // Weighted similarly to crimeChance but used as a gate
  const risk = (
    0.10
    + 0.30 * lowEmp
    + 0.30 * lowDis
    + 0.10 * hiCon
    + 0.10 * spreeF
    + 0.05 * crewF
    + 0.05 * idF
    - 0.15 * remorseF
  );

  return clamp01(risk);
}

// Seeded RNG matching game style
function seededRng(key, gameState) {
  const seedString = `${gameState.runSeed}|${key}|${gameState.currentYear}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash = hash & hash;
  }
  let seed = Math.abs(hash);
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// JJ Helpers + Narrative
export const JJ_PROMPT = "How do you respond?";

export function stripTrailingPrompt(text) {
  let t = String(text || "").trim();
  t = t.replace(/\s*(how do you respond\?|what do you do\?|what do you say\?|your move\.?)\s*$/i, "");
  return t.trim();
}

export function jjStageLabel({ kind, caughtStatus }) {
  if (kind === "temptation") return "⚖️ Temptation — a tiny choice with big momentum";
  if (kind === "incident") return caughtStatus === "caught"
    ? "⚖️ Incident (caught) — adults are involved now"
    : "⚖️ Incident (not caught) — you’re the only witness";
  if (kind === "diversion") return "⚖️ Diversion — paperwork arc unlocked";
  if (kind === "hall") return "⚖️ Juvenile Hall — fluorescent lights & consequences";
  if (kind === "probation") return "⚖️ Probation — freedom with receipts";
  return "⚖️ Juvenile Justice";
}

// Outcome pools (short-open/ react/ close)
export const JJ_OUTCOME_POOLS = {
  temptation: {
    A: {
      openers: [
        "You keep your face calm and your curiosity loud.",
        "You go full gentle detective: facts first, shame never.",
        "You ask one simple question and wait. (Harder than it sounds.)",
        "You choose connection over the instant lecture your soul wanted."
      ],
      reactions: [
        "{childName} talks more than you expected. Naming it shrinks it.",
        "{childName} exhales like they’d been holding a balloon of guilt.",
        "{childName} admits the part they didn’t want to admit: it felt powerful.",
        "{childName} tests you once… then relaxes when you don’t explode."
      ],
      closers: [
        "Together you build a tiny plan for the next tempting moment.",
        "You leave with a clear next step instead of a vague warning.",
        "You make honesty feel survivable — which makes it more likely next time."
      ]
    },
    B: {
      openers: [
        "You make the rule clear, simple, and non‑negotiable.",
        "You draw the line with your words, not your volume.",
        "You choose structure: boring, effective, undefeated."
      ],
      reactions: [
        "{childName} rolls their eyes like they’re 45. Then they listen.",
        "{childName} argues for loopholes. You don’t negotiate with loopholes.",
        "{childName} pouts — and also stops testing as hard."
      ],
      closers: [
        "They don’t love it, but the boundary becomes real.",
        "You trade short‑term peace for long‑term clarity.",
        "The situation gets safer because the rules get simpler."
      ]
    },
    C: {
      openers: [
        "You treat it like a skill, not a personality trait.",
        "You don’t just say ‘don’t’ — you rehearse the ‘how.’",
        "You turn it into practice instead of a sermon."
      ],
      reactions: [
        "{childName} thinks role‑play is cringe. Then they secretly like having words.",
        "{childName} laughs — then tries it again, more seriously.",
        "{childName} stumbles, restarts, and gets better. That’s the point."
      ],
      closers: [
        "You leave them with an exit ramp, not just a warning sign.",
        "You plant a future version of them who knows what to do.",
        "It’s awkward now… and easier later."
      ]
    },
    D: {
      openers: [
        "You let the moment pass because you’re tired, busy, or both.",
        "You decide it’s probably fine and move on.",
        "You choose silence — the most misunderstood parenting tool."
      ],
      reactions: [
        "{childName} notices. Kids always notice what gets ignored.",
        "{childName} learns the rule is negotiable if no one feels like enforcing it.",
        "{childName} gets a little bolder — not because they’re bad, but because it worked."
      ],
      closers: [
        "The temptation doesn’t vanish. It just goes underground.",
        "Nothing explodes today. But the pattern quietly grows teeth.",
        "Peace now, problems later — the classic subscription."
      ]
    }
  },
  incident: {
    A: {
      openers: [
        "You start with the truth, not the threat.",
        "You keep your voice low so their defenses don’t go high.",
        "You choose calm — even though your nervous system filed this under ‘PANIC.’"
      ],
      reactions: [
        "{childName} tries a few versions of the story. You wait for the real one.",
        "Once you’re not yelling, {childName} gets honest enough to be reachable.",
        "{childName} looks relieved and terrified at the same time."
      ],
      closers: [
        "You move from talk to repair: what happened, what it hurt, what happens next.",
        "You don’t let it slide — you let them face it with you.",
        "It becomes a turning point instead of a secret."
      ]
    },
    B: {
      openers: [
        "You set a consequence that fits the harm — not your mood.",
        "You make it clear: choices have costs, even when you love the chooser.",
        "You choose firm and fair. No theatrics."
      ],
      reactions: [
        "{childName} gets angry. Under the anger is embarrassment.",
        "{childName} complains it’s ‘not a big deal.’ You make it a deal — a learning one.",
        "{childName} sulks… and also understands you’re serious."
      ],
      closers: [
        "Restitution happens. The lesson stops being abstract.",
        "The boundary is clearer because it has follow‑through.",
        "It’s uncomfortable — which is why it works."
      ]
    },
    C: {
      openers: [
        "You choose accountability with a capital A.",
        "You don’t wait for the world to teach the lesson at full volume.",
        "You pick the hard right over the easy quiet."
      ],
      reactions: [
        "{childName} hates it in the moment. Later, it lands.",
        "{childName} acts tough. Their hands shake anyway.",
        "{childName} begs you not to. That’s how you know it matters."
      ],
      closers: [
        "Repair happens in public, not just in your kitchen.",
        "A paper trail might start — but so can a real change.",
        "It costs some comfort now and buys a future later."
      ]
    },
    D: {
      openers: [
        "You minimize it because you want this to be over.",
        "You protect them from consequences — which also protects the pattern.",
        "You choose ‘not today’ and hope the problem respects your schedule."
      ],
      reactions: [
        "{childName} learns secrecy works. Next time, they hide it better.",
        "{childName} reads your silence as permission, not mercy.",
        "The story becomes a private win instead of a public lesson."
      ],
      closers: [
        "If adults are already watching, the fallout hits harder later.",
        "It doesn’t disappear. It just upgrades.",
        "Avoidance feels kind… until it teaches the wrong thing."
      ]
    }
  },
  system: {
    A: {
      openers: [
        "You show up. Again. Consistency is louder than speeches.",
        "You keep the relationship intact while holding the line.",
        "You refuse to let ‘the system’ replace ‘the parent.’"
      ],
      reactions: [
        "{childName} acts like they don’t care — then watches to see if you really came.",
        "{childName} is prickly. You stay steady anyway.",
        "{childName} tests you. You don’t leave."
      ],
      closers: [
        "Slowly, safety returns — the boring kind that actually helps.",
        "It’s not a miracle. It’s repetition. That’s the point.",
        "You build a future that isn’t based on fear."
      ]
    },
    B: {
      openers: [
        "You add structure: routine, curfew, and fewer chaos windows.",
        "You make home predictable — not permissive.",
        "You turn your house into a recovery environment, not a loophole factory."
      ],
      reactions: [
        "{childName} calls it control. You call it stabilization.",
        "{childName} pushes back. The routine holds anyway.",
        "{childName} hates it. Also… it helps."
      ],
      closers: [
        "Less freedom now, more freedom later.",
        "The day gets smaller so the future can get bigger.",
        "You trade arguments for structure — which is its own kind of peace."
      ]
    },
    C: {
      openers: [
        "You lean into the program instead of fighting the existence of it.",
        "You choose skill‑building: therapy, school plans, restorative steps.",
        "You treat change like a process, not a vibe."
      ],
      reactions: [
        "{childName} tries sarcasm. Under it is fear of trying and failing.",
        "{childName} resists — then participates just enough to be reachable.",
        "{childName} has a tiny win. They pretend it didn’t matter."
      ],
      closers: [
        "Progress shows up in inches, not headlines.",
        "The ‘hard’ persona loosens when real competence grows.",
        "It’s not glamorous. It’s effective."
      ]
    },
    D: {
      openers: [
        "You emotionally check out and let paperwork raise your kid.",
        "You stop pushing because pushing is exhausting.",
        "You let the system be the only adult in the room."
      ],
      reactions: [
        "{childName} learns no one at home is steering.",
        "{childName} drifts back toward the people who feel easiest.",
        "{childName} gets tougher — and not in the good way."
      ],
      closers: [
        "Without support, the program becomes a box to resent, not a path to change.",
        "The gap between ‘rules’ and ‘values’ widens.",
        "Disengagement feels quiet. The consequences aren’t."
      ]
    }
  }
};

export function jjPatternShiftLine({ choiceLetter, age, caughtStatus, kind }) {
  const a = Number(age || 0);
  if (choiceLetter === 'A') return "Pattern shift: Momentum ↓ • Attention ↓ • Repair ↑ • Identity ↓";
  if (choiceLetter === 'B') return "Pattern shift: Momentum ↓↓ • Attention ↘ • Repair ↗";
  if (choiceLetter === 'C') {
    if (a < 14) return "Pattern shift: Momentum ↓↓↓ • Attention ↓↓ • Repair ↑↑ • Identity ↓↓";
    const paperTrail = (kind === 'incident' && a >= 14 && caughtStatus === 'not_caught');
    return `Pattern shift: Momentum ↓↓↓ • Attention ↓↓↓ • Repair ↑↑ • Identity ↓↓↓${paperTrail ? ' • Paper Trail ↑' : ''}`;
  }
  if (choiceLetter === 'D') {
    return caughtStatus === 'caught'
      ? "Pattern shift: Momentum ↑↑ • Attention ↑ • Repair ↓ • Identity ↑ • Crew pull ↑ • Paper Trail ↑"
      : "Pattern shift: Momentum ↑↑ • Attention ↑ • Repair ↓ • Identity ↑ • Crew pull ↑";
  }
  return "";
}

export function buildJJChoices(ctx, gameState) {
  const { kind, age, caughtStatus, scenarioId } = ctx;
  const roleByLetter = { A: 'connect', B: 'boundary', C: 'teach', D: 'avoid' };
  const deltasByLetter = {
    A: { empathy: 0.3 },
    B: { discipline: 0.5 },
    C: { discipline: 0.8 },
    D: { confidence: 0.4, empathy: -0.5 }
  };
  const texts = (k) => {
    if (k === 'temptation') return {
      A: "Get curious (no courtroom voice): “What made it tempting?”",
      B: "Name the rule + tighten the situation (clear boundary)",
      C: "Practice the ‘exit script’ (role‑play what to do next time)",
      D: "Let it slide / change the subject"
    };
    if (k === 'incident') return {
      A: "Talk first, then plan repair (connection → action)",
      B: "Immediate consequence + restitution (make it right)",
      C: "Choose accountability on purpose (return/repair, even if awkward)",
      D: "Minimize it / protect them from consequences"
    };
    // diversion/hall/probation → system
    return {
      A: "Show up consistently (relationship stays alive)",
      B: "Add structure at home (routine, curfew, devices, friends)",
      C: "Work the program (restorative steps, therapy, school plan)",
      D: "Disengage (“the system will handle it”)"
    };
  };
  const poolKey = (kind === 'diversion' || kind === 'hall' || kind === 'probation') ? 'system' : kind;
  const map = texts(kind);
  const childName = gameState.childName || 'your child';

  return ['A','B','C','D'].map((letter) => {
    const role = roleByLetter[letter];
    const deltas = deltasByLetter[letter];
    // Deterministic variety
    const rng = seededRng(`jj_outcome|${scenarioId}|${letter}`, gameState);
    function pick(arr){ if(!arr||!arr.length) return ''; return arr[Math.floor(rng()*arr.length)]; }
    const op = pick(JJ_OUTCOME_POOLS[poolKey][letter].openers).replaceAll('{childName}', childName);
    const react = pick(JJ_OUTCOME_POOLS[poolKey][letter].reactions).replaceAll('{childName}', childName);
    const close = pick(JJ_OUTCOME_POOLS[poolKey][letter].closers).replaceAll('{childName}', childName);
    const consequence = op; // punchy single‑line log
    const resultText = `${op} ${react}\n${close}\n${jjPatternShiftLine({ choiceLetter: letter, age, caughtStatus, kind })}`;

    return {
      letter,
      role,
      text: map[letter],
      consequence,
      resultText,
      deltas,
      jj: { choice: letter }
    };
  });
}

// --- ENGINE ---

export function getJuvenileJusticeScenario(gameState) {
  // Check triggers in order
  const { currentYear, juvenileJustice: jj, enabledScenarioPackIds } = gameState;
  
  if (!enabledScenarioPackIds?.includes('pack_juvenile_justice_v1')) {
    // If pack disabled, check for active statuses to finish them out
    if (!jj?.hall?.active && !jj?.diversion?.active && !jj?.probation?.active) {
      return null;
    }
  }

  // 1. Hall
  if (jj?.hall?.active) {
    const yearInHall = (jj.hall.startAge ? (currentYear - jj.hall.startAge + 1) : 1);
    const pool = HALL_SCENARIOS_BY_YEAR[Math.min(4, Math.max(1, yearInHall))];
    const rng = seededRng('hall_scenario', gameState);
    const scenario = pool[Math.floor(rng() * pool.length)];
    return formatJJScenario(scenario, gameState);
  }

  // 2. Diversion
  if (jj?.diversion?.active) {
    const rng = seededRng('diversion_scenario', gameState);
    const scenario = DIVERSION_SCENARIOS[Math.floor(rng() * DIVERSION_SCENARIOS.length)];
    return formatJJScenario(scenario, gameState);
  }

  // 3. Probation
  if (jj?.probation?.active) {
    const rng = seededRng('probation_scenario', gameState);
    const scenario = PROBATION_SCENARIOS[Math.floor(rng() * PROBATION_SCENARIOS.length)];
    return formatJJScenario(scenario, gameState);
  }

  // 4. Risk-gated crime checks
  const baseCheck = JJ_CHECK_AGES.includes(currentYear);
  const oddCheck = [7, 9, 11, 13, 15, 17].includes(currentYear);

  if (baseCheck) {
    return runCrimeCheck(gameState);
  }

  if (oddCheck) {
    const risk = computeJJRiskScore(gameState);
    const hasHighRisk = risk >= 0.35 || jj.spree >= 20 || jj.heat >= 20 || jj.crimeIdentity >= 20;
    if (hasHighRisk) {
      return runCrimeCheck(gameState);
    }
  }

  return null;
}

function runCrimeCheck(gameState) {
  const { currentYear, juvenileJustice: jj, stats } = gameState;
  const rng = seededRng('jj_check', gameState);

  // Opt-in check
  const isFresh = (!jj.spree && !jj.crew && !jj.crimeIdentity && !jj.record);
  const risk = computeJJRiskScore(gameState);
  
  if (isFresh && risk < 0.25) {
    // Only force Temptation if risk is low
    const poolAgeKey = getNearestJJPoolAgeKey(currentYear);
    const scenarioPool = JJ_SCENARIOS[poolAgeKey] || [];
    const pool = scenarioPool.filter(s => s.kind === 'temptation');
    if (!pool.length) return null;
    const scenario = pool[Math.floor(rng() * pool.length)];
    return formatJJScenario(scenario, gameState);
  }

  // Calculate Probability
  const lowEmp = clamp01((5 - (stats.empathy || 0)) / 15);
  const lowDis = clamp01((5 - (stats.discipline || 0)) / 15);
  const hiCon = clamp01(((stats.confidence || 0) - 8) / 20);
  
  const spreeF = clamp01((jj.spree || 0) / 100);
  const crewF = clamp01((jj.crew || 0) / 100);
  const idF = clamp01((jj.crimeIdentity || 0) / 100);
  const remorseF = clamp01((jj.remorse || 50) / 100);

  const crimeChance = clamp(
    0.05
    + 0.28*lowEmp
    + 0.28*lowDis
    + 0.10*hiCon
    + 0.18*spreeF
    + 0.10*crewF
    + 0.10*idF
    - 0.22*remorseF,
    0.01, 0.95
  );

  // Roll
  const didCrime = rng() < crimeChance;

  if (!didCrime) {
    // Return Temptation (decay happens elsewhere/on choice)
    const poolAgeKey = getNearestJJPoolAgeKey(currentYear);
    const scenarioPool = JJ_SCENARIOS[poolAgeKey] || [];
    const pool = scenarioPool.filter(s => s.kind === 'temptation');
    if (!pool.length) return null;
    const scenario = pool[Math.floor(rng() * pool.length)];
    return formatJJScenario(scenario, gameState);
  }

  // Incident Logic
  const ageFactor = clamp01((currentYear - 6) / 10);
  const severityScore = clamp01(
    0.20*spreeF
    + 0.18*lowEmp
    + 0.18*lowDis
    + 0.10*hiCon
    + 0.14*idF
    + 0.10*crewF
    + 0.10*ageFactor
  );

  let targetTier = 1;
  if (severityScore >= 0.82 && currentYear >= 14) targetTier = 4;
  else if (severityScore >= 0.58) targetTier = 3;
  else if (severityScore >= 0.33) targetTier = 2;

  // Use safe pool age key to avoid undefined scenarios
  const poolAgeKey = getNearestJJPoolAgeKey(currentYear);
  const scenarioPool = JJ_SCENARIOS[poolAgeKey] || [];
  
  // Filter pool by tier
  const pool = scenarioPool.filter(s => s.kind === 'incident' && s.tier === targetTier);
  // Fallback if empty tier
  const finalPool = pool.length ? pool : scenarioPool.filter(s => s.kind === 'incident');
  const scenario = finalPool[Math.floor(rng() * finalPool.length)];

  // Caught Check
  const loInt = clamp01((10 - (stats.intelligence || 0)) / 20);
  const hiInt = clamp01(((stats.intelligence || 0) - 10) / 25);
  const heatF = clamp01((jj.heat || 0) / 100);
  
  const baseCaught = {1: 0.62, 2: 0.52, 3: 0.42, 4: 0.32}[scenario.tier] || 0.5;
  const overconfidence = (hiInt > 0.75 && hiCon > 0.65 && spreeF > 0.60) ? 0.15 : 0.0;
  const crewAdj = (spreeF < 0.60) ? (-0.06 * crewF) : (0.06 * crewF);

  const caughtChance = clamp(
    baseCaught
    + 0.25*heatF
    + 0.10*loInt
    - 0.22*hiInt
    + 0.06*hiCon
    + overconfidence
    + crewAdj
    + (scenario.caughtBias || 0),
    0.05, 0.95
  );

  const caught = rng() < caughtChance;

  return formatJJScenario(scenario, gameState, caught);
}

function formatJJScenario(scenario, gameState, caught = false) {
  const { childName, parentName = "Parent" } = gameState;
  const caughtStatus = caught ? 'caught' : 'not_caught';
  const effectiveAge = (scenario.age ?? gameState.currentYear);

  const cleanedHook = stripTrailingPrompt((scenario.hook || '')
    .replace(/{childName}/g, childName)
    .replace(/{parentName}/g, parentName));

  let body = cleanedHook;
  if (scenario.kind === 'incident') {
    const reveal = caught ? scenario.revealCaught : scenario.revealNotCaught;
    if (reveal) body += "\n\n" + stripTrailingPrompt(reveal.replace(/{childName}/g, childName).replace(/{parentName}/g, parentName));
  }

  const stage = jjStageLabel({ kind: scenario.kind, caughtStatus });
  const scenarioText = `${stage}\n\n${body}\n\n${JJ_PROMPT}`;

  const choices = buildJJChoices({
    kind: scenario.kind,
    age: effectiveAge,
    caughtStatus,
    scenarioId: scenario.id
  }, gameState);

  return {
    ...scenario,
    age: effectiveAge,
    title: "Juvenile Justice",
    hookText: cleanedHook,
    scenarioText,
    choices,
    meta: {
      system: 'juvenileJustice',
      jj: {
        offense: scenario.offense,
        tier: scenario.tier,
        caughtStatus,
        kind: scenario.kind,
        age: effectiveAge,
        severityTier: (scenario.tier ?? 0)
      }
    }
  };
}