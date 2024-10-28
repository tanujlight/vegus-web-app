import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  openItemIndex: number | null = null;
  faqItems = [
    {
      question: 'How much does Coda AI cost?',
      answer: 'Unlike other tools where AI is a paid add-on, Coda AI is free for Doc Makers. Editors also receive a free trial of Coda AI. If you’d like to learn more about pricing and usage, visit <a href="#">this help article</a>.'
    },
    {
      question: 'What models does Coda AI leverage?',
      answer: 'Coda AI leverages various models to optimize performance, designed for real-time document processing.'
    },
    {
      question: 'How does Coda AI use my data?',
      answer: 'Coda AI ensures data privacy and security, following industry-standard protocols.'
    },
    {
      question: 'How can I learn more about using Coda AI for work?',
      answer: 'Visit our tutorials section to learn more about using Coda AI in your projects.'
    },
    {
      question: 'Was there a Coda AI Beta?',
      answer: 'Yes, Coda AI was available as a beta version to select users before the official release.'
    }
  ];

  constructor() { }

  // faq section
  toggleItem(index: number): void {
    this.openItemIndex = this.openItemIndex === index ? null : index;
  }
  ngOnInit(): void {
  }

}
