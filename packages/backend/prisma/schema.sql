CREATE TABLE genders (
    id integer NOT NULL,
    name character varying(10)
);

CREATE SEQUENCE genders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE neighborhoods (
    id integer NOT NULL,
    admin_id numeric NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(50),
    location character varying(50)
);

CREATE SEQUENCE neighborhoods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE neighborhoods_users (
    neighborhood_id integer NOT NULL,
    user_id integer NOT NULL,
    active boolean
);

CREATE TABLE requests (
    id integer NOT NULL,
    neighborhood_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(50) NOT NULL,
    content character varying(1000) NOT NULL,
    status integer,
    time_created timestamp with time zone
);

CREATE SEQUENCE requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE responses (
    id integer NOT NULL,
    request_id integer NOT NULL,
    user_id integer NOT NULL,
    content character varying(1000),
    status integer,
    time_created timestamp with time zone
);

CREATE SEQUENCE responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE users (
    id integer NOT NULL,
    user_name character varying(25) NOT NULL,
    password character varying(25) NOT NULL,
    first_name character varying(25),
    last_name character varying(25),
    dob date,
    gender_id integer,
    bio character varying(500)
);

CREATE SEQUENCE users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE users_id_seq OWNED BY users.id;

ALTER TABLE ONLY genders ALTER COLUMN id SET DEFAULT nextval('genders_id_seq'::regclass);
ALTER TABLE ONLY neighborhoods ALTER COLUMN id SET DEFAULT nextval('neighborhoods_id_seq'::regclass);
ALTER TABLE ONLY requests ALTER COLUMN id SET DEFAULT nextval('requests_id_seq'::regclass);
ALTER TABLE ONLY responses ALTER COLUMN id SET DEFAULT nextval('responses_id_seq'::regclass);
ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);

ALTER TABLE ONLY genders
    ADD CONSTRAINT genders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY neighborhoods
    ADD CONSTRAINT neighborhoods_pkey PRIMARY KEY (id);

ALTER TABLE ONLY neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_pkey PRIMARY KEY (neighborhood_id, user_id);

ALTER TABLE ONLY requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY responses
    ADD CONSTRAINT responses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id) ON DELETE CASCADE;

ALTER TABLE ONLY neighborhoods_users
    ADD CONSTRAINT neighborhoods_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE ONLY requests
    ADD CONSTRAINT requests_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id) ON DELETE CASCADE;

ALTER TABLE ONLY requests
    ADD CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE ONLY responses
    ADD CONSTRAINT responses_request_id_fkey FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE;

ALTER TABLE ONLY responses
    ADD CONSTRAINT responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE ONLY users
    ADD CONSTRAINT users_gender_fkey FOREIGN KEY (gender_id) REFERENCES genders(id);