--
-- Name: f_normalize(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION public.f_normalize(text)
RETURNS text AS $$
DECLARE
  -- Lista de caracteres a reemplazar
  accents text := 'áäâàéëêèíïîìóöôòúüûùÁÄÂÀÉËÊÈÍÏÎÌÓÖÔÒÚÜÛÙ';
  
  -- Los reemplazos
  no_accents text := 'aaaaeeeeiiiioooouuuuaaaaeeeeiiiioooouuuu';
BEGIN
  -- 1. Traduce SOLO las vocales acentuadas
  -- 2. Convierte a minúsculas
  --  La 'ñ' no está en la lista, así que se ignora y preserva.
  RETURN lower(translate($1, accents, no_accents));
END;
$$ LANGUAGE plpgsql IMMUTABLE;


ALTER FUNCTION public.f_normalize(text) OWNER TO postgres;

--
-- Name: fn_calculate_purchase_subtotal(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_calculate_purchase_subtotal() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  NEW.subtotal = NEW.quantity * NEW.unit_price;

  RETURN NEW;

END;

$$;


ALTER FUNCTION public.fn_calculate_purchase_subtotal() OWNER TO postgres;

--
-- Name: fn_calculate_sale_subtotal(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_calculate_sale_subtotal() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  NEW.subtotal = (NEW.quantity * NEW.unit_price) - NEW.discount;

  RETURN NEW;

END;

$$;


ALTER FUNCTION public.fn_calculate_sale_subtotal() OWNER TO postgres;

--
-- Name: fn_purchase_details_after_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_purchase_details_after_delete() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  -- Actualizar el total en Compras (resta lo viejo)

  UPDATE Purchases

  SET total = total - OLD.subtotal

  WHERE purchase_id = OLD.purchase_id;



  -- Actualizar el stock en Ingredientes (resta lo viejo)

  UPDATE Ingredients

  SET stock = stock - OLD.quantity

  WHERE ingredient_id = OLD.ingredient_id;

  

  RETURN OLD; -- En DELETE, se retorna OLD

END;

$$;


ALTER FUNCTION public.fn_purchase_details_after_delete() OWNER TO postgres;

--
-- Name: fn_purchase_details_after_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_purchase_details_after_insert() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  -- Actualizar el total en la tabla principal de Compras

  UPDATE Purchases

  SET total = total + NEW.subtotal

  WHERE purchase_id = NEW.purchase_id;



  -- Actualizar el stock en la tabla de Ingredientes

  UPDATE Ingredients

  SET stock = stock + NEW.quantity

  WHERE ingredient_id = NEW.ingredient_id;

  

  RETURN NEW; -- En un trigger AFTER, el valor de retorno se ignora, pero es buena práctica.

END;

$$;


ALTER FUNCTION public.fn_purchase_details_after_insert() OWNER TO postgres;

--
-- Name: fn_purchase_details_after_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_purchase_details_after_update() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  -- Actualizar el total en Compras (resta lo viejo, suma lo nuevo)

  UPDATE Purchases

  SET total = total - OLD.subtotal + NEW.subtotal

  WHERE purchase_id = NEW.purchase_id;



  -- Actualizar el stock en Ingredientes (resta lo viejo, suma lo nuevo)

  UPDATE Ingredients

  SET stock = stock - OLD.quantity + NEW.quantity

  WHERE ingredient_id = NEW.ingredient_id;

  

  RETURN NEW;

END;

$$;


ALTER FUNCTION public.fn_purchase_details_after_update() OWNER TO postgres;

--
-- Name: fn_sale_details_after_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_sale_details_after_delete() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  -- Actualizar el total en Ventas

  UPDATE Sales

  SET total = total - OLD.subtotal

  WHERE sale_id = OLD.sale_id;



  -- Devolver el stock de ingredientes

  -- Cambio: Sintaxis de UPDATE...FROM para PostgreSQL

  UPDATE Ingredients

  SET stock = Ingredients.stock + (Dish_Ingredients.quantity_used * OLD.quantity)

  FROM Dish_Ingredients

  WHERE Ingredients.ingredient_id = Dish_Ingredients.ingredient_id

  AND Dish_Ingredients.dish_id = OLD.dish_id;

  

  RETURN OLD;

END;

$$;


ALTER FUNCTION public.fn_sale_details_after_delete() OWNER TO postgres;

--
-- Name: fn_sale_details_after_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_sale_details_after_insert() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  -- Actualizar el total en la tabla principal de Ventas

  UPDATE Sales

  SET total = total + NEW.subtotal

  WHERE sale_id = NEW.sale_id;



  -- Descontar el stock de ingredientes

  -- Cambio: Sintaxis de UPDATE...FROM para PostgreSQL

  UPDATE Ingredients

  SET stock = GREATEST(0, Ingredients.stock - (Dish_Ingredients.quantity_used * NEW.quantity))

  FROM Dish_Ingredients

  WHERE Ingredients.ingredient_id = Dish_Ingredients.ingredient_id

  AND Dish_Ingredients.dish_id = NEW.dish_id;

  

  RETURN NEW;

END;

$$;


ALTER FUNCTION public.fn_sale_details_after_insert() OWNER TO postgres;

--
-- Name: fn_sale_details_after_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_sale_details_after_update() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  -- Actualizar el total en Ventas

  UPDATE Sales

  SET total = total - OLD.subtotal + NEW.subtotal

  WHERE sale_id = NEW.sale_id;



  -- Ajustar el stock (devuelve lo viejo, descuenta lo nuevo)

  -- Cambio: Sintaxis de UPDATE...FROM para PostgreSQL

  UPDATE Ingredients

  SET stock = GREATEST(0, Ingredients.stock + (Dish_Ingredients.quantity_used * OLD.quantity) - (Dish_Ingredients.quantity_used * NEW.quantity))

  FROM Dish_Ingredients

  WHERE Ingredients.ingredient_id = Dish_Ingredients.ingredient_id

  AND Dish_Ingredients.dish_id = NEW.dish_id;

  

  RETURN NEW;

END;

$$;


ALTER FUNCTION public.fn_sale_details_after_update() OWNER TO postgres;

--
-- Name: fn_sales_before_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_sales_before_insert() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

  IF NEW.customer IS NULL OR NEW.customer = '' THEN

  NEW.customer = 'Público general';

  END IF;

  RETURN NEW;

END;

$$;


ALTER FUNCTION public.fn_sales_before_insert() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

BEGIN

   NEW.updated_at = NOW(); -- NOW() es el equivalente a CURRENT_TIMESTAMP

   RETURN NEW;

END;

$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;
