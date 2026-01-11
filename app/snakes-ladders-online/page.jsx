// app/snakes-ladders-online/page.jsx
import SnakesLaddersMultiplayerRouter from '../../components/SnakesLaddersMultiplayerRouter';

export const metadata = {
  title: 'السلم والثعبان - متعدد اللاعبين ',
  description: 'لعبة السلم والثعبان التفاعلية - العب مع أصدقائك عبر الإنترنت!',
};

export default function SnakesLaddersOnlinePage() {
  return <SnakesLaddersMultiplayerRouter />;
}