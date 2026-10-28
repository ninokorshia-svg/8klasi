import { UserAnswerRecord, PerformanceLevel } from '../types';

export interface EvaluationResult {
  level: PerformanceLevel;
  levelBadge: string;
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
  };
  comment: string;
}

export interface SummativeAssessment {
  grade10: number; // 1-10 ბალიანი შეფასება
  score: number;   // 0-100 ქულა
  percentage: number;
  gradeDescription: string;
  status: string;
}

export function getSummativeAssessment(score: number = 0): SummativeAssessment {
  const safeScore = typeof score === 'number' && !isNaN(score) ? score : 0;
  const grade10 = Math.max(1, Math.min(10, Math.round(safeScore / 10)));
  let gradeDescription = 'დაბალი / საჭიროებს მხარდაჭერას';
  let status = 'საჭიროებს გაუმჯობესებას';

  if (grade10 >= 9) {
    gradeDescription = 'მაღალი / წარჩინებული';
    status = 'დაძლეულია წარჩინებით';
  } else if (grade10 >= 7) {
    gradeDescription = 'კარგი / საშუალოზე მაღალი';
    status = 'დაძლეულია კარგად';
  } else if (grade10 >= 5) {
    gradeDescription = 'საშუალო / დამაკმაყოფილებელი';
    status = 'დაძლეულია დამაკმაყოფილებლად';
  }

  return {
    grade10,
    score: safeScore,
    percentage: safeScore,
    gradeDescription,
    status,
  };
}

export function evaluateStudentWork(
  score: number,
  answers: UserAnswerRecord[],
  studentNumber: string,
  studentClass: string
): EvaluationResult {
  const mistakes = answers.filter(a => !a.isCorrect);
  const correct = answers.filter(a => a.isCorrect);

  const missedTopics = Array.from(new Set(mistakes.map(m => m.topic)));
  const masterTopics = Array.from(new Set(correct.map(c => c.topic)));

  if (score >= 80) {
    const masteredStr = masterTopics.length > 0 ? ` (წარმატებით გააზრებული თემები: ${masterTopics.join(', ')})` : '';
    const minorNote = missedTopics.length > 0
      ? `მცირე ყურადღება მიექცეს შემდეგ საკითხს: ${missedTopics.join(', ')}.`
      : 'ყველა დავალება უნაკლოდ არის შესრულებული.';

    return {
      level: 'გაფართოებული / შემოქმედებითი',
      levelBadge: '🌟 დონე: გაფართოებული / შემოქმედებითი',
      badgeStyle: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-900',
        border: 'border-emerald-300'
      },
      comment: `მოსწავლე №${studentNumber} (${studentClass}) — შეფასების დონე: გაფართოებული / შემოქმედებითი (${score}/100 ქულა, ${correct.length}/10 სწორი).
• მიღწევა: მოსწავლე სრულყოფილად და შემოქმედებითად ფლობს ენერგიის ძირითად ცნებებს${masteredStr}. ავლენს მაღალ სააზროვნო უნარებს, სწორად ასაბუთებს განახლებადი ენერგორესურსების მნიშვნელობას და აანალიზებს ეკოლოგიურ გამოწვევებს (სათბურის ეფექტს).
• რეკომენდაცია: ${minorNote} გააგრძელოს დამოუკიდებელი კვლევითი, შემოქმედებითი და პრაქტიკული აქტივობები.`
    };
  } else if (score >= 60) {
    const focusStr = missedTopics.length > 0
      ? `განსაკუთრებით გასაძლიერებელია: ${missedTopics.join(', ')}.`
      : 'საჭიროა შეცდომით მონიშნული საკითხების გადახედვა.';

    return {
      level: 'დამოუკიდებელი',
      levelBadge: '💡 დონე: დამოუკიდებელი',
      badgeStyle: {
        bg: 'bg-amber-100',
        text: 'text-amber-900',
        border: 'border-amber-300'
      },
      comment: `მოსწავლე №${studentNumber} (${studentClass}) — შეფასების დონე: დამოუკიდებელი (${score}/100 ქულა, ${correct.length}/10 სწორი).
• მიღწევა: მოსწავლეს აქვს მყარი დამოუკიდებელი ცოდნა ენერგიის თემაზე, დამოუკიდებლად ხსნის ძირითად დავალებებს, თუმცა უჭირს ზოგიერთი კომპლექსური მიზეზ-შედეგობრივი კავშირის ზუსტი დადგენა.
• ხარვეზები: ${focusStr}
• რეკომენდაცია: დამოუკიდებლად გაიმეოროს ენერგიის ურთიერთგარდაქმნის სქემები, თბოელექტროსადგურებისა და განახლებადი ენერგიის ეკოლოგიური შედარების საკითხები სასწავლო გზამკვლევის დახმარებით.`
    };
  } else {
    const criticalStr = missedTopics.length > 0
      ? `დაბრკოლება შეექმნა თემებში: ${missedTopics.join(', ')}.`
      : 'საკითხები საჭიროებს საფუძვლიან გადამუშავებას.';

    return {
      level: 'საჭიროებს მხარდაჭერას',
      levelBadge: '🤝 დონე: საჭიროებს მხარდაჭერას',
      badgeStyle: {
        bg: 'bg-rose-100',
        text: 'text-rose-900',
        border: 'border-rose-300'
      },
      comment: `მოსწავლე №${studentNumber} (${studentClass}) — შეფასების დონე: საჭიროებს მხარდაჭერას (${score}/100 ქულა, ${correct.length}/10 სწორი).
• მიღწევა: მოსწავლეს გააჩნია ინტერესი, თუმცა ავლენს ცნებების აღრევას (კინეტიკური vs პოტენციური ენერგია, განახლებადი vs არაგანახლებადი რესურსები) და საჭიროებს პედაგოგიურ მხარდაჭერას.
• ხარვეზები: ${criticalStr}
• რეკომენდაცია: მასწავლებელთან ერთად ინდივიდუალური მხარდაჭერა, საილუსტრაციო ბარათების გამოყენება და სასწავლო გზამკვლევის ხელახალი დამუშავება ცოდნის განსამტკიცებლად.`
    };
  }
}
