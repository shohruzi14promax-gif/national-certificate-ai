-- Non-official sample content for local/staging testing. source_type='sample'.
insert into public.subjects(name,slug,description,icon,sort_order) values
('Matematika','matematika','Milliy sertifikat uchun matematika tayyorgarligi','∑',1),('Tarix','tarix','O‘zbekiston va jahon tarixi','⌘',2),('Kimyo','kimyo','Kimyo nazariyasi va masalalar','⚗',3),('Biologiya','biologiya','Biologiya mavzulari va testlar','⌬',4),('Ona tili va adabiyot','ona-tili-adabiyot','Ona tili va adabiyot','Aa',5) on conflict(slug) do nothing;
insert into public.topics(subject_id,name,slug,sort_order) select s.id,v.name,v.slug,v.ord from public.subjects s join (values
('matematika','Algebra','algebra',1),('matematika','Geometriya','geometriya',2),('matematika','Funksiyalar','funksiyalar',3),('tarix','O‘zbekiston tarixi','ozbekiston-tarixi',1),('tarix','Jahon tarixi','jahon-tarixi',2),('kimyo','Atom tuzilishi','atom-tuzilishi',1),('kimyo','Kimyoviy reaksiyalar','kimyoviy-reaksiyalar',2),('biologiya','Hujayra','hujayra',1),('biologiya','Genetika','genetika',2),('ona-tili-adabiyot','Grammatika','grammatika',1),('ona-tili-adabiyot','Adabiyot tarixi','adabiyot-tarixi',2)
) v(subject_slug,name,slug,ord) on s.slug=v.subject_slug on conflict(subject_id,slug) do nothing;

with rows(subject_slug,topic_slug,text,diff,explanation) as (values
('matematika','algebra','2x + 6 = 14 tenglamaning yechimi qaysi?','easy','2x=8, demak x=4.'),
('matematika','geometriya','Tomonlari 6 va 8 bo‘lgan to‘g‘ri to‘rtburchakning yuzi nechaga teng?','easy','S=6×8=48.'),
('matematika','funksiyalar','f(x)=2x+3 bo‘lsa, f(5) nechaga teng?','easy','2×5+3=13.'),
('tarix','ozbekiston-tarixi','Amir Temur davlatining poytaxti qaysi shahar bo‘lgan?','medium','Samarqand Amir Temur davrida poytaxt bo‘lgan.'),
('tarix','jahon-tarixi','Renessans dastlab qaysi hududda keng rivojlangan?','medium','Renessans dastlab Italiyada rivojlangan.'),
('kimyo','atom-tuzilishi','Atomning musbat zaryadli zarrachasi qaysi?','easy','Proton musbat zaryadga ega.'),
('kimyo','kimyoviy-reaksiyalar','H2O ning molyar massasi taxminan nechaga teng?','easy','2×1+16=18 g/mol.'),
('biologiya','hujayra','Hujayraning irsiy axborotni saqlovchi tuzilmasi qaysi?','easy','DNK irsiy axborotning asosiy tashuvchisidir.'),
('biologiya','genetika','Dominant allel odatda qanday belgilanadi?','easy','Dominant allel katta harf bilan belgilanadi.'),
('ona-tili-adabiyot','grammatika','Qaysi so‘z turkumi predmetning belgisini bildiradi?','easy','Sifat predmetning belgisini bildiradi.'),
('ona-tili-adabiyot','adabiyot-tarixi','Alisher Navoiy qaysi asrda yashagan?','easy','Navoiy XV asrning buyuk mutafakkiri.')
) insert into public.questions(subject_id,topic_id,text,difficulty,explanation,source,source_type,status) select s.id,t.id,r.text,r.diff,r.explanation,'National Certificate AI sample','sample','published' from rows r join public.subjects s on s.slug=r.subject_slug join public.topics t on t.subject_id=s.id and t.slug=r.topic_slug where not exists(select 1 from public.questions q where q.text=r.text);
