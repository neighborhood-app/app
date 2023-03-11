--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Homebrew)
-- Dumped by pg_dump version 15.1 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neighborhood; Type: DATABASE; Schema: -; Owner: robertrodes
--

CREATE DATABASE neighborhood WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';


\connect neighborhood

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: neighborhoods; Type: TABLE; Schema: public; Owner: robertrodes
--

CREATE TABLE public.neighborhoods (
    id integer NOT NULL,
    admin_id numeric NOT NULL,
    name character varying(50),
    description character varying(50),
    location character varying(50)
);


--
-- Name: neighborhoods_id_seq; Type: SEQUENCE; Schema: public; Owner: robertrodes
--

CREATE SEQUENCE public.neighborhoods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: neighborhoods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: robertrodes
--

ALTER SEQUENCE public.neighborhoods_id_seq OWNED BY public.neighborhoods.id;


--
-- Name: neighborhoods_users; Type: TABLE; Schema: public; Owner: robertrodes
--

CREATE TABLE public.neighborhoods_users (
    neighborhood_id integer NOT NULL,
    user_id integer NOT NULL,
    active boolean
);


--
-- Name: requests; Type: TABLE; Schema: public; Owner: robertrodes
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    neighborhood_id integer NOT NULL,
    user_id integer NOT NULL,
    content character varying(1000),
    status integer,
    time_created timestamp with time zone
);


--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: robertrodes
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: robertrodes
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: responses; Type: TABLE; Schema: public; Owner: robertrodes
--

CREATE TABLE public.responses (
    id integer NOT NULL,
    request_id integer NOT NULL,
    user_id integer NOT NULL,
    content character varying(1000),
    status integer,
    time_created timestamp with time zone
);


--
-- Name: responses_id_seq; Type: SEQUENCE; Schema: public; Owner: robertrodes
--

CREATE SEQUENCE public.responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: robertrodes
--

ALTER SEQUENCE public.responses_id_seq OWNED BY public.responses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: robertrodes
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_name character varying(25) NOT NULL,
    password character varying(25) NOT NULL,
    first_name character varying(25),
    last_name character varying(25),
    dob date,
    gender numeric,
    bio character varying(500)
);



--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: robertrodes
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: robertrodes
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: neighborhoods id; Type: DEFAULT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.neighborhoods ALTER COLUMN id SET DEFAULT nextval('public.neighborhoods_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Name: responses id; Type: DEFAULT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.responses ALTER COLUMN id SET DEFAULT nextval('public.responses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: neighborhoods neighborhoods_pkey; Type: CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.neighborhoods
    ADD CONSTRAINT neighborhoods_pkey PRIMARY KEY (id);


--
-- Name: neighborhoods_users neighborhoods_users_pkey; Type: CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_pkey PRIMARY KEY (neighborhood_id, user_id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: responses responses_pkey; Type: CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: neighborhoods_users neighborhoods_users_neighborhood_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES public.neighborhoods(id) ON DELETE CASCADE;


--
-- Name: neighborhoods_users neighborhoods_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: requests requests_neighborhood_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES public.neighborhoods(id) ON DELETE CASCADE;


--
-- Name: requests requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: responses responses_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;


--
-- Name: responses responses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: robertrodes
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

