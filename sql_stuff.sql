select * from notification
delete from notification where 1=1
insert into notification (id, content, subject_id) values (1, 'ovo je obavijest', 1)
select * from app_user

select * from role
insert into role (role_id, role_name) values (6, 'administrator');

select * from app_user
delete from app_user where user_id=94

update app_user set email='nepravda30@gmail.com' where email = 'PROMIJENI'

select * from teacher

insert into teacher (id, name, professed_subject_subject_id, is_class_teacher) values (1, 'Marko', 1, true)

select * from certificate_type;
select * from certificate_request;

insert into certificate_type (id, name) values (3, 'POTVRDA O ZAVRSENOM RAZREDU')