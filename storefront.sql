drop database if exists storefront_db;
create database storefront_db;
use storefront_db;

create table inventory (
	id int (5) not null auto_increment,
    department varchar (20) not null, 
    name varchar (20) not null,
    price decimal (10,2) not null default 0,
    quantity decimal (10,0) not null default 1,
    primary key (id)
);


-- insert into inventory (name,price,quantity)
-- 	values ("collage",300, 1);
    
select * from inventory;