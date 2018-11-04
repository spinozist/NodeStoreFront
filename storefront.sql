drop database if exists storefront_db;
create database storefront_db;
use storefront_db;

create table inventory (
	id int (5) not null auto_increment,
    department varchar (20) not null, 
    name varchar (20) not null,
    price decimal (10,2) not null default 0,
    in_stock decimal (10,0) not null default 1,
    primary key (id)
);

create table sales (
	sale_id int (5) not null auto_increment,
    item_id int (5) not null,
    quantity decimal (10,0) not null,
    primary key (sale_id)
);


insert into inventory (name,price,in_stock,department)
	values 
    ("collage",300, 1,"art"),
    ("cloud maker", 175, 10, "science"),
    ("ability of flight", 800, 5,"magic");
    

    
    
select * from inventory;
select * from sales;

SELECT item_id, id, quantity, name 
FROM sales 
LEFT JOIN inventory ON sales.item_id = inventory.id;
