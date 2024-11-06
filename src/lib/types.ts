export type User = {
  id: number;
  user_group: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  username: string;
  email: string;
  password: string;
};

export type UserCredentials = {
  username: string;
  password: string;
};

export type Owner = {
  name: string;
  phone_number: string;
  email: string;
  mailing_address: string;
  mailing_city: string;
  mailing_state: string;
  mailing_zipcode: string;
};

export type Tenant = {
  name: string;
  phone_number: string;
  email: string;
  mailing_address: string;
  mailing_city: string;
  mailing_state: string;
  mailing_zipcode: string;
};
