import useStore from '@/Store';
import { Tab } from './tab';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

function ConsoleTab() {
  const { annotations, setAnnotations } = useStore();

  return (
    <Tab>
      <Label className="text-white">Annotations</Label>
      <Textarea
        className="bg-white/10 border-none h-48 text-xs text-white"
        defaultValue={JSON.stringify(annotations, null, 2)}
      />
    </Tab>
  );
}

export default ConsoleTab;
