--
-- Name: purchase_details trg_purchase_details_after_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_purchase_details_after_delete AFTER DELETE ON public.purchase_details FOR EACH ROW EXECUTE FUNCTION public.fn_purchase_details_after_delete();


--
-- Name: purchase_details trg_purchase_details_after_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_purchase_details_after_insert AFTER INSERT ON public.purchase_details FOR EACH ROW EXECUTE FUNCTION public.fn_purchase_details_after_insert();


--
-- Name: purchase_details trg_purchase_details_after_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_purchase_details_after_update AFTER UPDATE ON public.purchase_details FOR EACH ROW EXECUTE FUNCTION public.fn_purchase_details_after_update();


--
-- Name: purchase_details trg_purchase_details_before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_purchase_details_before_insert BEFORE INSERT ON public.purchase_details FOR EACH ROW EXECUTE FUNCTION public.fn_calculate_purchase_subtotal();


--
-- Name: purchase_details trg_purchase_details_before_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_purchase_details_before_update BEFORE UPDATE ON public.purchase_details FOR EACH ROW EXECUTE FUNCTION public.fn_calculate_purchase_subtotal();


--
-- Name: sale_details trg_sale_details_after_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sale_details_after_delete AFTER DELETE ON public.sale_details FOR EACH ROW EXECUTE FUNCTION public.fn_sale_details_after_delete();


--
-- Name: sale_details trg_sale_details_after_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sale_details_after_insert AFTER INSERT ON public.sale_details FOR EACH ROW EXECUTE FUNCTION public.fn_sale_details_after_insert();


--
-- Name: sale_details trg_sale_details_after_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sale_details_after_update AFTER UPDATE ON public.sale_details FOR EACH ROW EXECUTE FUNCTION public.fn_sale_details_after_update();


--
-- Name: sale_details trg_sale_details_before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sale_details_before_insert BEFORE INSERT ON public.sale_details FOR EACH ROW EXECUTE FUNCTION public.fn_calculate_sale_subtotal();


--
-- Name: sale_details trg_sale_details_before_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sale_details_before_update BEFORE UPDATE ON public.sale_details FOR EACH ROW EXECUTE FUNCTION public.fn_calculate_sale_subtotal();


--
-- Name: sales trg_sales_before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sales_before_insert BEFORE INSERT ON public.sales FOR EACH ROW EXECUTE FUNCTION public.fn_sales_before_insert();


--
-- Name: dish_categories trg_update_dish_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_dish_categories_updated_at BEFORE UPDATE ON public.dish_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: dishes trg_update_dishes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_dishes_updated_at BEFORE UPDATE ON public.dishes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ingredient_categories trg_update_ingredient_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_ingredient_categories_updated_at BEFORE UPDATE ON public.ingredient_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ingredients trg_update_ingredients_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_ingredients_updated_at BEFORE UPDATE ON public.ingredients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: purchase_details trg_update_purchase_details_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_purchase_details_updated_at BEFORE UPDATE ON public.purchase_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: purchases trg_update_purchases_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_purchases_updated_at BEFORE UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: sale_details trg_update_sale_details_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_sale_details_updated_at BEFORE UPDATE ON public.sale_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: sales trg_update_sales_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_sales_updated_at BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: suppliers trg_update_suppliers_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
