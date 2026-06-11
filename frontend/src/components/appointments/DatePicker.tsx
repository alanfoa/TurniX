const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isDateDisabled(year: number, month: number, day: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(year, month, day);
  return date < today;
}

interface DatePickerProps {
  selected: number | null;
  onSelect: (day: number) => void;
  year: number;
  month: number;
  onMonthChange?: (month: number) => void;
  onYearChange?: (year: number) => void;
}

export function DatePicker({ selected, onSelect, year, month }: DatePickerProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-foreground font-semibold text-sm">Elegí una fecha</p>
        <span className="text-muted-foreground text-sm font-medium">{MONTHS[month]} {year}</span>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-muted-foreground py-1 text-xs font-semibold">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const past = isDateDisabled(year, month, day);
          const active = selected === day;
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();
          return (
            <button
              key={i}
              disabled={past}
              onClick={() => !past && onSelect(day)}
              className="aspect-square rounded-lg flex items-center justify-center transition-all text-xs"
              style={{
                fontWeight: active ? 700 : 500,
                background: active ? "var(--color-primary)" : isToday ? "var(--color-accent)" : "transparent",
                color: active ? "var(--color-primary-foreground)" : past ? "var(--color-border)" : isToday ? "var(--color-primary)" : "var(--color-foreground)",
                cursor: past ? "not-allowed" : "pointer",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
