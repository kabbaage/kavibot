const AgentChoices = {
  raze: {
    description: 'Explosive',
    viper: ['sent out her Boom Bot through the toxic screen and blew up'],
    sage: ['pulled out her Showstopper rocket launcher and blew through the wall deployed by'],
    sova: ['ignored all the arrows around her and threw her grenade straight at'],
  },
  viper: {
    description: 'Toxic',
    sage: ['covered the  radianite crystals with her snake bite, poisoning'],
    neon: ['created her large chemical cloud, leaving nowhere to run for'],
    harbor: ['deployed her toxic screen, which poisoned', '\'s high tide'],
  },
  sage: {
    description: 'Healing Queen',
    sova: ['deployed her barrier, blocking all the arrows from'],
    fade: ['healed instantly after the decay afflicted by'],
    neon: ['threw a slow orb, nullifying the speed boost of'],
  },
  sova: {
    description: 'Hawkeye',
    viper: ['shot a recon arrow through the toxic screen finding the exact location of'],
    fade: ['screamed \'I, am the hunter!\' at'],
    harbor: ['shot his shock dart at all the water, electrocuting'],
  },
  fade: {
    description: 'Nightmare inducing',
    raze: ['sent out a prowler before the boom bot could be deployed, and took down'],
    viper: ['threw her watcher through the toxic screen finding the exact location of'],
    neon: ['threw her knot of fear, siezing the usually fast'],
  },
  neon: {
    description: 'Fast and electrifying',
    raze: ['was too fast for the rocket launcher, and beamed down'],
    sova: ['absorbed the shock bolt enhancing her bioelectricity, and shocked'],
    harbor: ['shot her relay dart at all the water, electrocuting'],
  },
  harbor: {
    description: 'Water God',
    raze: ['extinguished all the explosives, and soaked'],
    sage: ['threw his high tide at the barrier, and soaked'],
    fade: ['was too cheerful to be paranoid, and soaked'],
  },
};

export default AgentChoices;