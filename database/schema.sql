-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.dish_categories (
  category_id integer NOT NULL DEFAULT nextval('dish_categories_category_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  status USER-DEFINED DEFAULT 'Active'::status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT dish_categories_pkey PRIMARY KEY (category_id)
);
CREATE TABLE public.dish_ingredients (
  dish_ingredient_id integer NOT NULL DEFAULT nextval('dish_ingredients_dish_ingredient_id_seq'::regclass),
  dish_id integer NOT NULL,
  ingredient_id integer NOT NULL,
  quantity_used numeric NOT NULL,
  CONSTRAINT dish_ingredients_pkey PRIMARY KEY (dish_ingredient_id),
  CONSTRAINT dish_ingredients_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dishes(dish_id),
  CONSTRAINT dish_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(ingredient_id)
);
CREATE TABLE public.dishes (
  dish_id integer NOT NULL DEFAULT nextval('dishes_dish_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  category_id integer DEFAULT 1,
  price numeric NOT NULL,
  status USER-DEFINED DEFAULT 'Active'::status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT dishes_pkey PRIMARY KEY (dish_id),
  CONSTRAINT dishes_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.dish_categories(category_id)
);
CREATE TABLE public.ingredient_categories (
  category_id integer NOT NULL DEFAULT nextval('ingredient_categories_category_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  status USER-DEFINED DEFAULT 'Active'::status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT ingredient_categories_pkey PRIMARY KEY (category_id)
);
CREATE TABLE public.ingredients (
  ingredient_id integer NOT NULL DEFAULT nextval('ingredients_ingredient_id_seq'::regclass),
  name character varying NOT NULL,
  unit character varying DEFAULT 'unidad'::character varying,
  category_id integer DEFAULT 1,
  status USER-DEFINED DEFAULT 'Active'::status_enum,
  stock numeric DEFAULT 0.00,
  minimum_stock integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT ingredients_pkey PRIMARY KEY (ingredient_id),
  CONSTRAINT ingredients_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.ingredient_categories(category_id)
);
CREATE TABLE public.purchase_details (
  purchase_detail_id integer NOT NULL DEFAULT nextval('purchase_details_purchase_detail_id_seq'::regclass),
  purchase_id integer,
  ingredient_id integer,
  quantity numeric NOT NULL,
  unit_price numeric NOT NULL,
  subtotal numeric NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT purchase_details_pkey PRIMARY KEY (purchase_detail_id),
  CONSTRAINT purchase_details_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.purchases(purchase_id),
  CONSTRAINT purchase_details_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(ingredient_id)
);
CREATE TABLE public.purchases (
  purchase_id integer NOT NULL DEFAULT nextval('purchases_purchase_id_seq'::regclass),
  supplier_id integer,
  purchase_date date DEFAULT CURRENT_DATE,
  notes text,
  total numeric NOT NULL DEFAULT 0.00,
  status USER-DEFINED DEFAULT 'Completed'::process_status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT purchases_pkey PRIMARY KEY (purchase_id),
  CONSTRAINT purchases_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id)
);
CREATE TABLE public.sale_details (
  sale_detail_id integer NOT NULL DEFAULT nextval('sale_details_sale_detail_id_seq'::regclass),
  sale_id integer,
  dish_id integer,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  discount numeric DEFAULT 0,
  subtotal numeric NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT sale_details_pkey PRIMARY KEY (sale_detail_id),
  CONSTRAINT sale_details_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id),
  CONSTRAINT sale_details_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dishes(dish_id)
);
CREATE TABLE public.sales (
  sale_id integer NOT NULL DEFAULT nextval('sales_sale_id_seq'::regclass),
  sale_date date DEFAULT CURRENT_DATE,
  customer character varying DEFAULT 'Público general'::character varying,
  notes text,
  total numeric NOT NULL DEFAULT 0.00,
  status USER-DEFINED DEFAULT 'Completed'::process_status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT sales_pkey PRIMARY KEY (sale_id)
);
CREATE TABLE public.suppliers (
  supplier_id integer NOT NULL DEFAULT nextval('suppliers_supplier_id_seq'::regclass),
  name character varying NOT NULL,
  ruc character varying,
  phone character varying,
  email character varying,
  address character varying,
  contact_person character varying,
  status USER-DEFINED DEFAULT 'Active'::status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone,
  CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id)
);