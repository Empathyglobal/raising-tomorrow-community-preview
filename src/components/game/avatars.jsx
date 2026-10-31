export const AVATAR_GIRL = ['👧', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿'];
export const AVATAR_BOY = ['👦', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿'];

export const getAvatarEmojiForAge = (age, gender, tone) => {
  const list = gender === 'girl' ? AVATAR_GIRL : AVATAR_BOY;
  return list[tone % list.length] || list[0];
};