export interface SauceCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export type CreateCategoryPageProps = {
  onCreated?: () => Promise<void> | void;
};

export type CreateCategoryFormValues = {
  name: string;
};
