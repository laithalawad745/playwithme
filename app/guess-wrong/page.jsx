// app/guess-wrong/page.jsx
import GuessWrongGame from '../../components/GuessWrongGame';

export const metadata = {
  title: 'خمن الخطأ ',
  description: 'لعبة خمن الخطأ - تجنب اختيار الشخص الصحيح!',
};

export default function GuessWrongPage() {
  return <GuessWrongGame />;
}