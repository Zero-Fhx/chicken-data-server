--
-- Name: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

--
-- Name: process_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.process_status_enum AS ENUM (
  'Completed',
  'Cancelled'
);

--
-- Name: status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_enum AS ENUM (
  'Active',
  'Inactive'
);

--
-- Name: dish_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dish_categories (
  category_id integer NOT NULL,
  name character varying(50) NOT NULL,
  description text,
  status public.status_enum DEFAULT 'Active'::public.status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.dish_categories OWNER TO postgres;

--
-- Name: dish_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dish_categories_category_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.dish_categories_category_id_seq OWNER TO postgres;

--
-- Name: dish_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dish_categories_category_id_seq OWNED BY public.dish_categories.category_id;


--
-- Name: dish_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dish_ingredients (
  dish_ingredient_id integer NOT NULL,
  dish_id integer NOT NULL,
  ingredient_id integer NOT NULL,
  quantity_used numeric(10,3) NOT NULL
);


ALTER TABLE public.dish_ingredients OWNER TO postgres;

--
-- Name: dish_ingredients_dish_ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dish_ingredients_dish_ingredient_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.dish_ingredients_dish_ingredient_id_seq OWNER TO postgres;

--
-- Name: dish_ingredients_dish_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dish_ingredients_dish_ingredient_id_seq OWNED BY public.dish_ingredients.dish_ingredient_id;


--
-- Name: dishes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dishes (
  dish_id integer NOT NULL,
  name character varying(100) NOT NULL,
  description text,
  category_id integer DEFAULT 1,
  price numeric(10,2) NOT NULL,
  status public.status_enum DEFAULT 'Active'::public.status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.dishes OWNER TO postgres;

--
-- Name: dishes_dish_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dishes_dish_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.dishes_dish_id_seq OWNER TO postgres;

--
-- Name: dishes_dish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dishes_dish_id_seq OWNED BY public.dishes.dish_id;


--
-- Name: ingredient_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient_categories (
  category_id integer NOT NULL,
  name character varying(50) NOT NULL,
  description text,
  status public.status_enum DEFAULT 'Active'::public.status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.ingredient_categories OWNER TO postgres;

--
-- Name: ingredient_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredient_categories_category_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.ingredient_categories_category_id_seq OWNER TO postgres;

--
-- Name: ingredient_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredient_categories_category_id_seq OWNED BY public.ingredient_categories.category_id;


--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredients (
  ingredient_id integer NOT NULL,
  name character varying(100) NOT NULL,
  unit character varying(20) DEFAULT 'unidad'::character varying,
  category_id integer DEFAULT 1,
  status public.status_enum DEFAULT 'Active'::public.status_enum,
  stock numeric(10,2) DEFAULT 0.00,
  minimum_stock integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.ingredients OWNER TO postgres;

--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_ingredient_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.ingredients_ingredient_id_seq OWNER TO postgres;

--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_ingredient_id_seq OWNED BY public.ingredients.ingredient_id;


--
-- Name: purchase_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_details (
  purchase_detail_id integer NOT NULL,
  purchase_id integer,
  ingredient_id integer,
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.purchase_details OWNER TO postgres;

--
-- Name: purchase_details_purchase_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_details_purchase_detail_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.purchase_details_purchase_detail_id_seq OWNER TO postgres;

--
-- Name: purchase_details_purchase_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_details_purchase_detail_id_seq OWNED BY public.purchase_details.purchase_detail_id;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchases (
  purchase_id integer NOT NULL,
  supplier_id integer,
  purchase_date date DEFAULT CURRENT_DATE,
  notes text,
  total numeric(10,2) DEFAULT 0.00 NOT NULL,
  status public.process_status_enum DEFAULT 'Completed'::public.process_status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.purchases OWNER TO postgres;

--
-- Name: purchases_purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchases_purchase_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.purchases_purchase_id_seq OWNER TO postgres;

--
-- Name: purchases_purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchases_purchase_id_seq OWNED BY public.purchases.purchase_id;


--
-- Name: sale_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale_details (
  sale_detail_id integer NOT NULL,
  sale_id integer,
  dish_id integer,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  discount numeric(10,2) DEFAULT 0,
  subtotal numeric(10,2) NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.sale_details OWNER TO postgres;

--
-- Name: sale_details_sale_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sale_details_sale_detail_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.sale_details_sale_detail_id_seq OWNER TO postgres;

--
-- Name: sale_details_sale_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sale_details_sale_detail_id_seq OWNED BY public.sale_details.sale_detail_id;


--
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales (
  sale_id integer NOT NULL,
  sale_date date DEFAULT CURRENT_DATE,
  customer character varying(100) DEFAULT 'Público general'::character varying,
  notes text,
  total numeric(10,2) DEFAULT 0.00 NOT NULL,
  status public.process_status_enum DEFAULT 'Completed'::public.process_status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- Name: sales_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_sale_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.sales_sale_id_seq OWNER TO postgres;

--
-- Name: sales_sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_sale_id_seq OWNED BY public.sales.sale_id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
  supplier_id integer NOT NULL,
  name character varying(100) NOT NULL,
  ruc character varying(20),
  phone character varying(20),
  email character varying(100),
  address character varying(150),
  contact_person character varying(100),
  status public.status_enum DEFAULT 'Active'::public.status_enum,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp without time zone
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_supplier_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER SEQUENCE public.suppliers_supplier_id_seq OWNER TO postgres;

--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_supplier_id_seq OWNED BY public.suppliers.supplier_id;

--
-- Name: dish_categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_categories ALTER COLUMN category_id SET DEFAULT nextval('public.dish_categories_category_id_seq'::regclass);


--
-- Name: dish_ingredients dish_ingredient_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_ingredients ALTER COLUMN dish_ingredient_id SET DEFAULT nextval('public.dish_ingredients_dish_ingredient_id_seq'::regclass);


--
-- Name: dishes dish_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dishes ALTER COLUMN dish_id SET DEFAULT nextval('public.dishes_dish_id_seq'::regclass);


--
-- Name: ingredient_categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_categories ALTER COLUMN category_id SET DEFAULT nextval('public.ingredient_categories_category_id_seq'::regclass);


--
-- Name: ingredients ingredient_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN ingredient_id SET DEFAULT nextval('public.ingredients_ingredient_id_seq'::regclass);


--
-- Name: purchase_details purchase_detail_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_details ALTER COLUMN purchase_detail_id SET DEFAULT nextval('public.purchase_details_purchase_detail_id_seq'::regclass);


--
-- Name: purchases purchase_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases ALTER COLUMN purchase_id SET DEFAULT nextval('public.purchases_purchase_id_seq'::regclass);


--
-- Name: sale_details sale_detail_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_details ALTER COLUMN sale_detail_id SET DEFAULT nextval('public.sale_details_sale_detail_id_seq'::regclass);


--
-- Name: sales sale_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales ALTER COLUMN sale_id SET DEFAULT nextval('public.sales_sale_id_seq'::regclass);


--
-- Name: suppliers supplier_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN supplier_id SET DEFAULT nextval('public.suppliers_supplier_id_seq'::regclass);

--
-- Name: dish_categories dish_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_categories
  ADD CONSTRAINT dish_categories_name_key UNIQUE (name);


--
-- Name: dish_categories dish_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_categories
  ADD CONSTRAINT dish_categories_pkey PRIMARY KEY (category_id);


--
-- Name: dish_ingredients dish_ingredient_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_ingredients
  ADD CONSTRAINT dish_ingredient_unique UNIQUE (dish_id, ingredient_id);


--
-- Name: dish_ingredients dish_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_ingredients
  ADD CONSTRAINT dish_ingredients_pkey PRIMARY KEY (dish_ingredient_id);


--
-- Name: dishes dishes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dishes
  ADD CONSTRAINT dishes_pkey PRIMARY KEY (dish_id);


--
-- Name: ingredient_categories ingredient_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_categories
  ADD CONSTRAINT ingredient_categories_name_key UNIQUE (name);


--
-- Name: ingredient_categories ingredient_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_categories
  ADD CONSTRAINT ingredient_categories_pkey PRIMARY KEY (category_id);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
  ADD CONSTRAINT ingredients_pkey PRIMARY KEY (ingredient_id);


--
-- Name: purchase_details purchase_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_details
  ADD CONSTRAINT purchase_details_pkey PRIMARY KEY (purchase_detail_id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
  ADD CONSTRAINT purchases_pkey PRIMARY KEY (purchase_id);


--
-- Name: sale_details sale_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_details
  ADD CONSTRAINT sale_details_pkey PRIMARY KEY (sale_detail_id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
  ADD CONSTRAINT sales_pkey PRIMARY KEY (sale_id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
  ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);

ALTER TABLE ONLY public.dish_ingredients
  ADD CONSTRAINT dish_ingredients_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dishes(dish_id);


--
-- Name: dish_ingredients dish_ingredients_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_ingredients
  ADD CONSTRAINT dish_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(ingredient_id);


--
-- Name: dishes dishes_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dishes
  ADD CONSTRAINT dishes_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.dish_categories(category_id);


--
-- Name: ingredients ingredients_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
  ADD CONSTRAINT ingredients_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.ingredient_categories(category_id);


--
-- Name: purchase_details purchase_details_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_details
  ADD CONSTRAINT purchase_details_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(ingredient_id);


--
-- Name: purchase_details purchase_details_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_details
  ADD CONSTRAINT purchase_details_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.purchases(purchase_id);


--
-- Name: purchases purchases_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
  ADD CONSTRAINT purchases_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id);


--
-- Name: sale_details sale_details_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_details
  ADD CONSTRAINT sale_details_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dishes(dish_id);


--
-- Name: sale_details sale_details_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_details
  ADD CONSTRAINT sale_details_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id);

--
-- (Tu último FOREIGN KEY)
--
ALTER TABLE ONLY public.sale_details
  ADD CONSTRAINT sale_details_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id);


--
-- Name: Trigram GIN Indexes; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_dishes_name_trgm_gin ON public.dishes
USING GIN (public.f_normalize(name) gin_trgm_ops);

CREATE INDEX idx_dishes_desc_trgm_gin ON public.dishes
USING GIN (public.f_normalize(description) gin_trgm_ops);

CREATE INDEX idx_ingredients_name_trgm_gin ON public.ingredients
USING GIN (public.f_normalize(name) gin_trgm_ops);

CREATE INDEX idx_dish_cat_name_trgm_gin ON public.dish_categories
USING GIN (public.f_normalize(name) gin_trgm_ops);

CREATE INDEX idx_ing_cat_name_trgm_gin ON public.ingredient_categories
USING GIN (public.f_normalize(name) gin_trgm_ops);

CREATE INDEX idx_sales_customer_trgm_gin ON public.sales
USING GIN (public.f_normalize(customer) gin_trgm_ops);

CREATE INDEX idx_suppliers_name_trgm_gin ON public.suppliers
USING GIN (public.f_normalize(name) gin_trgm_ops);

CREATE INDEX idx_suppliers_email_trgm_gin ON public.suppliers
USING GIN (public.f_normalize(email) gin_trgm_ops);

CREATE INDEX idx_suppliers_contact_trgm_gin ON public.suppliers
USING GIN (public.f_normalize(contact_person) gin_trgm_ops);

--
-- Name: ingredients check_stock_non_negative; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE public.ingredients
  ADD CONSTRAINT check_stock_non_negative CHECK (stock >= 0);