////////////////////////////////////// модули //////////////////////////
// работа с БД
const mysql = require('mysql2');
// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'faq'
  });

// чтение файлов
const read = require('read-file');

//////////////////////////////////// настройки ....................
// документ для чтения
const path     = 'tests txt/';
const docs = ['Acheive_PMP_Exam_6th_formatted.txt', 'N_Mock_PMP_Exam_Test_01_formatted.txt', 'N_Mock_PMP_Exam_Text_02_formatted.txt', 'N_Mock_PMP_Exam_Text_03_formatted.txt', 'PMI_mock_free_test_formatted.txt', 'PMP_Exam_Practice_01_10_formatted.txt', 'PMP_Exam_Practice_01_formatted.txt', 'PMP_Exam_Practice_02_10_formatted.txt', 'PMP_Exam_Practice_02_formatted.txt', 'PMP_Exam_Practice_03_10_formatted.txt', 'PMP_Exam_Practice_03_formatted.txt', 'PMP_Exam_Practice_04_10_formatted.txt', 'PMP_Exam_Practice_04_formatted.txt', 'PMP_Exam_Practice_05_formatted.txt', 'PMP_Exam_Practice_06_10_formatted.txt', 'PMP_Exam_Practice_06_formatted.txt', 'PMP_Exam_Practice_07_formatted.txt', 'PMP_Exam_Practice_08_10_formatted.txt', 'PMP_Exam_Practice_08_formatted.txt', 'PMP_Exam_Practice_09_formatted.txt', 'PMP_Exam_Practice_10_10_formatted.txt', 'PMP_Exam_Practice_10_formatted.txt', 'PMP_Exam_Practice_11_formatted.txt', 'PMP_Exam_Practice_12_10_formatted.txt', 'PMP_Exam_Practice_12_formatted.txt', 'PMP_Exam_Practice_13_formatted.txt', 'PMP_Exam_Practice_14_10_formatted.txt', 'PMP_Exam_Practice_14_formatted.txt', 'PMP_Exam_Practice_15_formatted.txt', 'PMP_Exam_Practice_16_10_formatted.txt', 'PMP_Exam_Practice_16_formatted.txt', 'PMP_Exam_Practice_17_10_formatted.txt', 'PMP_Exam_Practice_17_formatted.txt', 'PMP_Exam_Practice_18_30_formatted.txt', 'PMP_Exam_Practice_18_formatted.txt', 'PMP_PML_Mock_01_formatted.txt', 'PMP_PML_Mock_02_formatted.txt', 'PMP_PML_Mock_03_formatted.txt', 'Rita_book_test_formatted.txt'];

// любые символы
const anySymbols = "[\\s\\S]+?";
// вопрос
const question = "Q[0-9]{0,3} (?<question>"+anySymbols+") ";
// 1 ответ
const A = "A\\. (?<A>"+anySymbols+") ";
// 2 ответ
const B = "B\\. (?<B>"+anySymbols+") ";
// 3 ответ
const C = "C\\. (?<C>"+anySymbols+") ";
// 4 ответ
const D = "D\\. (?<D>"+anySymbols+") ";
// правильный ответ
const correct = "Correct Answer: (?<correct>"+anySymbols+") Section:";
// регулярка для поиска вопросов и ответов в тексте
const regq = new RegExp(question + A + B + C + D + correct, "gm")



///////////////////////////////// прога ///////////////////////// 
// перебираем все документы
for(const doc of docs){
  // получаем текст из файла
  read(path+doc, 'utf8', function(err, buffer) {

    // удаляем лишние символы (переноса строк)
    buffer = buffer.replace(/(\r\n|\n|\r)/gm," ");

    // находим фопросы и ответы 
    let faqs = buffer.matchAll(regq)

    // для сохранения преобразоыванных вопросов и ответов
    let data = [];

    // перебираем каждый ответ
    for(const faq of faqs){

      // сокращаем запись
      const faqG = faq.groups;
    
      // меняем местами правильный ответ и первый ответ
      // сохраняем первый ответ
      const A = faqG.A
      // меняем A на правильный ответ
      faqG.A = faqG[faqG.correct];
      // меняем правильный на А
      faqG[faqG.correct] = A;

      const data = [faqG.question, faqG.A, faqG.B, faqG.C, faqG.D]

      // записываем в БД
      connection.query("INSERT INTO pmp (question, correct, b, c, d) VALUES (?,?,?,?,?)", data, err =>{
        // выводим ошибку
        if(err) console.log(err.sqlMessage, doc, data)
      })
      
    
      
    }

      
  });

}// end for



