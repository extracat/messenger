--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: snezhi
--

CREATE TABLE conversations (
    id integer NOT NULL,
    name text,
    type character varying(32)
);


ALTER TABLE conversations OWNER TO snezhi;

--
-- Name: conversation_id_seq; Type: SEQUENCE; Schema: public; Owner: snezhi
--

CREATE SEQUENCE conversation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE conversation_id_seq OWNER TO snezhi;

--
-- Name: conversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: snezhi
--

ALTER SEQUENCE conversation_id_seq OWNED BY conversations.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: snezhi
--

CREATE TABLE messages (
    id integer NOT NULL,
    id_sender integer,
    id_conversation integer,
    time_sent timestamp without time zone DEFAULT now(),
    time_delivered timestamp without time zone,
    time_read timestamp without time zone,
    content text
);


ALTER TABLE messages OWNER TO snezhi;

--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: snezhi
--

CREATE SEQUENCE message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE message_id_seq OWNER TO snezhi;

--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: snezhi
--

ALTER SEQUENCE message_id_seq OWNED BY messages.id;


--
-- Name: test_table; Type: TABLE; Schema: public; Owner: snezhi
--

CREATE TABLE test_table (
    id integer NOT NULL,
    name text
);


ALTER TABLE test_table OWNER TO snezhi;

--
-- Name: test_table_id_seq; Type: SEQUENCE; Schema: public; Owner: snezhi
--

CREATE SEQUENCE test_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_table_id_seq OWNER TO snezhi;

--
-- Name: test_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: snezhi
--

ALTER SEQUENCE test_table_id_seq OWNED BY test_table.id;


--
-- Name: user_conversation; Type: TABLE; Schema: public; Owner: snezhi
--

CREATE TABLE user_conversation (
    id_conversation integer NOT NULL,
    id_user integer NOT NULL
);


ALTER TABLE user_conversation OWNER TO snezhi;

--
-- Name: users; Type: TABLE; Schema: public; Owner: snezhi
--

CREATE TABLE users (
    id integer NOT NULL,
    date_reg timestamp without time zone DEFAULT now(),
    username text,
    password text,
    email text,
    name text
);


ALTER TABLE users OWNER TO snezhi;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: snezhi
--

CREATE SEQUENCE users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO snezhi;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: snezhi
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY conversations ALTER COLUMN id SET DEFAULT nextval('conversation_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY messages ALTER COLUMN id SET DEFAULT nextval('message_id_seq'::regclass);


--
-- Name: test_table id; Type: DEFAULT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY test_table ALTER COLUMN id SET DEFAULT nextval('test_table_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: snezhi
--

COPY conversations (id, name, type) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: snezhi
--

COPY messages (id, id_sender, id_conversation, time_sent, time_delivered, time_read, content) FROM stdin;
\.


--
-- Data for Name: test_table; Type: TABLE DATA; Schema: public; Owner: snezhi
--

COPY test_table (id, name) FROM stdin;
1	Tony Basso
2	David Vassa
3	John Mind
\.


--
-- Data for Name: user_conversation; Type: TABLE DATA; Schema: public; Owner: snezhi
--

COPY user_conversation (id_conversation, id_user) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: snezhi
--

COPY users (id, date_reg, username, password, email, name) FROM stdin;
2	2018-01-23 00:27:19.667308	test	12345	test@test.ru	Mister Tester
4	2018-01-23 00:46:10.509245	test1	12345	test1@test.ru	Mister Tester
5	2018-01-23 00:46:41.206514	test2	12345	test2@test.ru	Mister Tester
6	2018-01-23 00:53:07.356385	test3	12345	test3@test.ru	Mister Tester
7	2018-01-28 22:14:05.309715	\N	\N	\N	\N
8	2018-01-28 22:17:54.516167	\N	\N	\N	\N
\.


--
-- Name: conversation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: snezhi
--

SELECT pg_catalog.setval('conversation_id_seq', 1, false);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: snezhi
--

SELECT pg_catalog.setval('message_id_seq', 1, false);


--
-- Name: test_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: snezhi
--

SELECT pg_catalog.setval('test_table_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: snezhi
--

SELECT pg_catalog.setval('users_id_seq', 8, true);


--
-- Name: conversations conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY conversations
    ADD CONSTRAINT conversation_pkey PRIMARY KEY (id);


--
-- Name: messages message_pkey; Type: CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- Name: test_table test_table_pkey; Type: CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY test_table
    ADD CONSTRAINT test_table_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: messages message_id_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT message_id_sender_fkey FOREIGN KEY (id_sender) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_conversation user_conversation_id_conversation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY user_conversation
    ADD CONSTRAINT user_conversation_id_conversation_fkey FOREIGN KEY (id_conversation) REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_conversation user_conversation_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: snezhi
--

ALTER TABLE ONLY user_conversation
    ADD CONSTRAINT user_conversation_id_user_fkey FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

