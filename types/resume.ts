export type ResumeSection = {
  title: string;
  items: {
    heading: string;
    meta: string;
    details: string[];
    placeholder?: boolean;
  }[];
};
