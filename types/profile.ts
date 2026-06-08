export type ProfileLink = {
  label: string;
  href: string;
  placeholder?: boolean;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  university: string;
  shortBio: string;
  longBio: string;
  focusAreas: string[];
  targetRoles: string[];
  links: {
    email: ProfileLink;
    github: ProfileLink;
    linkedin: ProfileLink;
    resume: ProfileLink;
  };
};
