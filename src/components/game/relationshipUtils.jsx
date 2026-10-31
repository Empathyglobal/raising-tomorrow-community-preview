export function isPersonDead(person) {
  if (!person || typeof person !== 'object') return false;
  const status = String(person.status || '').toLowerCase();
  const hasDeathYear = Number.isFinite(Number(person.deathYear));
  return person.isDeceased === true || person.alive === false || hasDeathYear || status === 'dead' || status === 'deceased';
}

export function finalizePartnerSeparation(state, { mode = 'breakup', keepAsCoparent = 'auto' } = {}) {
  // mode: 'divorce' | 'breakup'
  // keepAsCoparent:
  //  - 'auto' (default): if the run currently has a child, keep partner as child co-parent (father_of_child/mother_of_child)
  //  - true: always keep as co-parent
  //  - false: always move partner to an ex_* entry
  const existingPartnerEntry = state?.relationships?.byId?.partner || state?.relationships?.roster?.find(p => p.id === 'partner');
  const hasPartnerData = !!(existingPartnerEntry || state?.partnerName);

  if (!hasPartnerData) return state;

  const hasChild =
    state.childless !== true &&
    state.hasChild !== false &&
    (!!state.childName || !!state?.relationships?.byId?.child);

  const shouldKeepAsCoparent = keepAsCoparent === true || (keepAsCoparent === 'auto' && hasChild);

  const roleFromGender = (genderKey) => (String(genderKey).toLowerCase() === 'female' ? 'mother_of_child' : 'father_of_child');
  const inferOtherParentRole = () => {
    if (state.parentRole === 'mom') return 'father_of_child';
    if (state.parentRole === 'dad') return 'mother_of_child';
    // neutral / unknown
    return roleFromGender(existingPartnerEntry?.genderKey || existingPartnerEntry?.avatarGenderKey || state.partnerAvatarGender || 'male');
  };

  const rel = state.relationships || { roster: [], byId: {} };
  const roster0 = Array.isArray(rel.roster) ? [...rel.roster] : [];
  const byId0 = { ...(rel.byId || {}) };

  // Remove the old partner entry if present
  const rosterNoPartner = roster0.filter(p => p?.id !== 'partner');
  delete byId0.partner;

  let nextRoster = rosterNoPartner;
  let nextById = byId0;
  let coparentProfilePatch = state.coparentProfile;

  if (shouldKeepAsCoparent) {
    const otherParentRole = inferOtherParentRole();

    // remove any existing other-parent entry to avoid duplicates
    nextRoster = nextRoster.filter(p => p?.id !== otherParentRole);
    delete nextById[otherParentRole];

    const partnerName = existingPartnerEntry?.name || state.partnerName || 'Co-parent';
    const partnerEmoji = existingPartnerEntry?.emoji || state.partnerEmoji || '🧑';

    const coparentEntry = {
      ...(existingPartnerEntry || {}),
      id: otherParentRole,
      role: otherParentRole,
      name: partnerName,
      emoji: partnerEmoji,
      identityStatus: 'known',
      originType: 'known_ex',
      alive: existingPartnerEntry?.alive ?? true,
      isDeceased: existingPartnerEntry?.isDeceased ?? false,
      deathYear: existingPartnerEntry?.deathYear ?? null,
      // Preserve cultures if present (important for later name generation)
      cultures: existingPartnerEntry?.cultures,
      // Keep meters/interactions where possible
      meter: Number.isFinite(Number(existingPartnerEntry?.meter)) ? Number(existingPartnerEntry.meter) : (state.partnerMeter ?? 50),
      interactionsByAge: existingPartnerEntry?.interactionsByAge || {},
      createdAtAge: existingPartnerEntry?.createdAtAge ?? (state.currentYear || 0),
      baseAge: existingPartnerEntry?.baseAge ?? (state.partnerAgeAtBirth ?? 28),
      age: existingPartnerEntry?.age ?? ((existingPartnerEntry?.baseAge ?? state.partnerAgeAtBirth ?? 28) + (state.currentYear || 0)),
    };

    nextRoster = [...nextRoster, coparentEntry];
    nextById = { ...nextById, [otherParentRole]: coparentEntry };

    const cpGenderKey = String(coparentEntry.avatarGenderKey || coparentEntry.genderKey || 'unknown').toLowerCase();
    coparentProfilePatch = {
      name: coparentEntry.name,
      emoji: coparentEntry.emoji,
      gender: cpGenderKey === 'male' ? 'boy' : (cpGenderKey === 'female' ? 'girl' : 'unknown'),
      meter: Math.max(0, Math.min(100, Number(coparentEntry.meter ?? 50))),
    };
  } else {
    const exRole = mode === 'divorce' ? 'ex_spouse' : 'ex_partner';
    const exId = `${exRole}_${Date.now()}`;
    const exEntry = {
      ...(existingPartnerEntry || {}),
      id: exId,
      role: exRole,
      name: existingPartnerEntry?.name || state.partnerName || 'Ex',
      emoji: existingPartnerEntry?.emoji || state.partnerEmoji || '🧑',
    };
    nextRoster = [...nextRoster, exEntry];
    nextById = { ...nextById, [exId]: exEntry };
  }

  return {
    ...state,
    householdType: 'single',
    partnerRelationship: {
      ...(state.partnerRelationship || {}),
      status: 'single',
      engagedAtAge: null,
      marriedAtAge: null,
      ring: null,
      wedding: null,
      openRelationship: { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null },
      crisis: null
    },
    partnerName: null,
    partnerEmoji: null,
    partnerMeter: null,
    partnerCareer: null,
    partnerAvatarGender: null,
    partnerAvatarSpriteIndex: null,
    partnerPatterns: [],
    coparentProfile: coparentProfilePatch,
    relationships: { roster: nextRoster, byId: nextById }
  };
}