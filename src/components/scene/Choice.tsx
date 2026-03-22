interface ChoiceOption {
  label: string;
  value: string;
}

interface ChoiceProps {
  options: ChoiceOption[];
  onSelect: (value: string) => void;
  selected?: string;
}

export default function Choice({ options, onSelect, selected }: ChoiceProps) {
  return (
    <div className="choice-group" role="group">
      {options.map((option) => (
        <button
          key={option.value}
          className={`choice-btn ${selected === option.value ? 'choice-btn--selected' : ''}`}
          onClick={() => onSelect(option.value)}
          aria-pressed={selected === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
