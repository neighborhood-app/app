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

CREATE TABLE public.neighborhoods (
    id integer NOT NULL,
    admin_id numeric NOT NULL,
    name character varying(50),
    description character varying(50),
    location character varying(50)
);

CREATE SEQUENCE public.neighborhoods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.neighborhoods_id_seq OWNED BY public.neighborhoods.id;

CREATE TABLE public.neighborhoods_users (
    neighborhood_id integer NOT NULL,
    user_id integer NOT NULL,
    active boolean
);

CREATE TABLE public.requests (
    id integer NOT NULL,
    neighborhood_id integer NOT NULL,
    user_id integer NOT NULL,
    content character varying(1000),
    status integer,
    time_created timestamp with time zone
);

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;

CREATE TABLE public.responses (
    id integer NOT NULL,
    request_id integer NOT NULL,
    user_id integer NOT NULL,
    content character varying(1000),
    status integer,
    time_created timestamp with time zone
);

CREATE SEQUENCE public.responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.responses_id_seq OWNED BY public.responses.id;

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

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

ALTER TABLE ONLY public.neighborhoods ALTER COLUMN id SET DEFAULT nextval('public.neighborhoods_id_seq'::regclass);

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);

ALTER TABLE ONLY public.responses ALTER COLUMN id SET DEFAULT nextval('public.responses_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

ALTER TABLE ONLY public.neighborhoods
    ADD CONSTRAINT neighborhoods_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_pkey PRIMARY KEY (neighborhood_id, user_id);

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES public.neighborhoods(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES public.neighborhoods(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

