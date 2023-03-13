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

CREATE TABLE public.genders (
    id integer NOT NULL,
    name character varying(10)
);

CREATE SEQUENCE public.genders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.genders_id_seq OWNED BY public.genders.id;

CREATE TABLE public.neighborhoods (
    id integer NOT NULL,
    admin_id numeric NOT NULL,
    name character varying(50) NOT NULL,
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

CREATE TABLE public.neighborhoods_users (
    neighborhood_id integer NOT NULL,
    user_id integer NOT NULL,
    active boolean
);

CREATE TABLE public.requests (
    id integer NOT NULL,
    neighborhood_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(50) NOT NULL,
    content character varying(1000) NOT NULL,
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
    gender_id integer,
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

ALTER TABLE ONLY public.genders ALTER COLUMN id SET DEFAULT nextval('public.genders_id_seq'::regclass);

ALTER TABLE ONLY public.neighborhoods ALTER COLUMN id SET DEFAULT nextval('public.neighborhoods_id_seq'::regclass);

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);

ALTER TABLE ONLY public.responses ALTER COLUMN id SET DEFAULT nextval('public.responses_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

COPY public.genders (id, name) FROM stdin;
1	Male
2	Female
\.

COPY public.neighborhoods (id, admin_id, name, description, location) FROM stdin;
\.

COPY public.neighborhoods_users (neighborhood_id, user_id, active) FROM stdin;
\.

COPY public.requests (id, neighborhood_id, user_id, title, content, status, time_created) FROM stdin;
\.

COPY public.responses (id, request_id, user_id, content, status, time_created) FROM stdin;
\.

COPY public.users (id, user_name, password, first_name, last_name, dob, gender_id, bio) FROM stdin;
\.

SELECT pg_catalog.setval('public.genders_id_seq', 2, true);

SELECT pg_catalog.setval('public.neighborhoods_id_seq', 1, false);

SELECT pg_catalog.setval('public.requests_id_seq', 1, false);

SELECT pg_catalog.setval('public.responses_id_seq', 1, false);

SELECT pg_catalog.setval('public.users_id_seq', 1, false);

ALTER TABLE ONLY public.genders
    ADD CONSTRAINT genders_pkey PRIMARY KEY (id);

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

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_gender_fkey FOREIGN KEY (gender_id) REFERENCES public.genders(id);
