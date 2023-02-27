const AgentChoices = {
  brimstone: {
    description: "Boomer",
    raze: ["'s smoke obscured all the places", " could throw her grenade from"],
  },
  viper: {
    description: "Almost as toxic as Flow",
    sage: ["covered the  radianite crystals with her snake bite, poisoning"],
    raze: ["'s toxic screen made it impossible for", " to aim her grenade correctly, and it blew up in her hand"],
    neon: ["created her large chemical cloud, leaving nowhere to run for"],
    harbor: ["deployed her toxic screen, which poisoned", "'s high tide"],
  },
  omen: {
    description: "Shadow",
    raze: ["teleported away from", "'s grenade"],
  },
  killjoy: {
    description: "Bot Queen",
    raze: ["and", " go for a coffee date instead of fighting"],
  },
  cypher: {
    description: "Baldy",
    raze: ["triggered his cage which meant", " had no idea where to throw her grenade"],
  },
  sova: {
    description: "Hawkeye",
    viper: ["shot a recon arrow through the toxic screen finding the exact location of"],
    raze: ["bounced his shock bolt around the corner", "'s Boom Bot was deployed from. Direct hit"],
    fade: ["screamed 'I, am the hunter!' at"],
    harbor: ["shot his shock dart at all the water, electrocuting"],
  },
  sage: {
    description: "Healing Queen",
    sova: ["deployed her barrier, blocking all the arrows from"],
    raze: ["deployed her barrier, blocking both, ", "'s Boom Bot and Grenade"],
    neon: ["threw a slow orb, nullifying the speed boost of"],
    fade: ["healed instantly after the decay afflicted by"],
  },
  phoenix: {
    description: "Fire boi",
    raze: ["used his flash, leaving", " and her Boom Bot blind and confused"],
  },
  jett: {
    description: "Fast and annoying",
    raze: ["dodged the grenade. She dodged the rocket launcher. And threw a knife at"],
  },
  reyna: {
    description: "Empress",
    raze: ["threw her eye near", ", leaving her blinded with nowhere to throw her grenade"],
  },
  raze: {
    description: "Explosive",
    brimstone: ["sent out her Boom Bot through the smoke cloud and blew up"],
    viper: ["sent out her Boom Bot through the toxic screen and blew up"],
    omen: ["threw her grenade right where", " teleported"],
    killjoy: ["and", " go for a coffee date instead of fighting"],
    cypher: ["'s Boom Bot went right under", "'s trap wire and blew up in his face"],
    sova: ["ignored all the arrows around her and threw her grenade straight at"],
    sage: ["jumped over the wall with her blast packs, pulled out her rocket launcher and blew up"],
    phoenix: ["jumped over", "'s fire zone with her blast pack and took him down"],
    jett: ["shot her rocket launcher right where", " jumped up to. No dodging that"],
    reyna: ["'s grenade's explosions get", " before she's able to fully consume the soul orb"],
    raze: [],
    breach: ["'s Boom Bot was not affected by the seismic blast and hunts down"],
    skye: ["saw", "'s Tasmanian tiger as it was sent out and threw her grenade right where it came from"],
    yoru: ["heard", " teleport and threw her grenade right where he landed"],
    astra: ["sent out her Boom Bot through the Nebula smoke cloud and blew up"],
    kayo: ["deployed her Boom Bot right before", " threw his knife. Not suppressed"],
    chamber: ["left blast packs at", "'s teleport anchor. Right as he teleported to safety, he was launched back in danger"],
    neon: ["'s Boom Bot went right between", "'s energy lines and blew in her face"],
    fade: ["used her blast packs to quickly get out of", "'s seize and took her down"],
    harbor: ["'s bullets didn't go through", "'s water sphere. But her grenade did. He thought he was safe in there"],
  },
  breach: {
    description: "Daddy Breach",
    raze: ["used his blinding charge, leaving", " and her Boom Bot blind and confused"],
  },
  skye: {
    description: "Bird Lady",
    raze: ["used her hawks, leaving", " and her Boom Bot blind and confused"],
  },
  yoru: {
    description: "Dimension Traveller",
    raze: ["teleported away from", "'s grenade"],
  },
  astra: {
    description: "Asstral Queen",
    raze: ["'s Gravity well pulled", " and her Boom bot in before it could go anywhere"],
  },
  kayo: {
    description: "Loud Robot",
    raze: ["deployed his knife right before", " deployed her Boom Bot. Suppressed"],
  },
  chamber: {
    description: "Charming Bastard",
    raze: ["teleported away from", "'s grenade"],
  },
  neon: {
    description: "Fast and electrifying",
    sova: ["absorbed the shock bolt enhancing her bioelectricity, and shocked"],
    raze: ["was too fast for the rocket launcher, and beamed down"],
    harbor: ["shot her relay dart at all the water, electrocuting"],
  },
  fade: {
    description: "Nightmare inducing",
    viper: ["threw her watcher through the toxic screen finding the exact location of"],
    raze: ["sent out a prowler before the boom bot could be deployed, and took down"],
    neon: ["threw her knot of fear, siezing the usually fast"],
  },
  harbor: {
    description: "Water God",
    sage: ["threw his high tide at the barrier, and soaked"],
    raze: ["extinguished all the explosives, and soaked"],
    fade: ["was too cheerful to be paranoid, and soaked"],
  },
};

export default AgentChoices;