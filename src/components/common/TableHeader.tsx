interface TableHeaderProps {
  columnTitles: string[];
}

const TableHeader = ({ columnTitles }: TableHeaderProps) => (
  <thead>
    <tr>
      {columnTitles.map((columnTitle, index) => (
        <th key={index}>{columnTitle}</th>
      ))}
    </tr>
  </thead>
);

export default TableHeader;
