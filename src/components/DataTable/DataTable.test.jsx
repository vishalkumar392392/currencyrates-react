import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from './DataTable';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const columns = [
  { key: 'id',   label: 'ID'   },
  { key: 'name', label: 'Name' },
  { key: 'age',  label: 'Age'  },
];

const data = [
  { id: 1, name: 'Alice',   age: 30 },
  { id: 2, name: 'Bob',     age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
  { id: 4, name: 'Diana',   age: 28 },
  { id: 5, name: 'Eve',     age: 22 },
];

// DataTable renders each non-custom cell inside a TooltipWrapper+TooltipBox,
// so the same text appears twice in the DOM. Use these helpers for assertions.
const hasText   = (text) => screen.getAllByText(text).length > 0;
const lacksText = (text) => screen.queryAllByText(text).length === 0;

// ─── Rendering ───────────────────────────────────────────────────────────────

describe('DataTable – basic rendering', () => {
  test('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  test('renders all data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(hasText('Alice')).toBe(true);
    expect(hasText('Bob')).toBe(true);
    expect(hasText('Charlie')).toBe(true);
  });

  test('renders empty message when data is empty', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No records found.')).toBeInTheDocument();
  });

  test('renders custom emptyMessage', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Nothing here!" />);
    expect(screen.getByText('Nothing here!')).toBeInTheDocument();
  });

  test('renders no search bar when searchable is not set', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.queryByPlaceholderText('Search…')).not.toBeInTheDocument();
  });

  test('renders search bar when searchable is true', () => {
    render(<DataTable columns={columns} data={data} searchable />);
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });

  test('renders custom searchPlaceholder', () => {
    render(<DataTable columns={columns} data={data} searchable searchPlaceholder="Find…" />);
    expect(screen.getByPlaceholderText('Find…')).toBeInTheDocument();
  });

  test('renders custom cell via col.render', () => {
    const cols = [
      { key: 'id',   label: 'ID' },
      { key: 'name', label: 'Name', render: (v) => <strong data-testid="custom">{v}!</strong> },
    ];
    render(<DataTable columns={cols} data={[{ id: 1, name: 'Alice' }]} />);
    expect(screen.getByTestId('custom')).toHaveTextContent('Alice!');
  });
});

// ─── Search ──────────────────────────────────────────────────────────────────

describe('DataTable – global search', () => {
  test('filters rows matching the search term', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} searchable />);
    await user.type(screen.getByPlaceholderText('Search…'), 'alice');
    expect(hasText('Alice')).toBe(true);
    expect(lacksText('Bob')).toBe(true);
  });

  test('search is case-insensitive', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} searchable />);
    await user.type(screen.getByPlaceholderText('Search…'), 'BOB');
    expect(hasText('Bob')).toBe(true);
    expect(lacksText('Alice')).toBe(true);
  });

  test('shows empty message when no rows match search', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} searchable />);
    await user.type(screen.getByPlaceholderText('Search…'), 'xyz_no_match');
    expect(screen.getByText('No records found.')).toBeInTheDocument();
  });

  test('all rows remain visible when searchable is false', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(hasText('Alice')).toBe(true);
    expect(hasText('Bob')).toBe(true);
    expect(hasText('Charlie')).toBe(true);
  });
});

// ─── Per-column filter ────────────────────────────────────────────────────────

describe('DataTable – per-column filter', () => {
  test('renders Filter… inputs when filterable is true', () => {
    render(<DataTable columns={columns} data={data} filterable />);
    expect(screen.getAllByPlaceholderText('Filter…').length).toBe(columns.length);
  });

  test('does not render filter row when filterable is false', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.queryByPlaceholderText('Filter…')).not.toBeInTheDocument();
  });

  test('filters rows by column value', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} filterable />);
    const [, nameFilter] = screen.getAllByPlaceholderText('Filter…');
    await user.type(nameFilter, 'charlie');
    expect(hasText('Charlie')).toBe(true);
    expect(lacksText('Alice')).toBe(true);
  });

  test('col.filterable=false suppresses filter input for that column', () => {
    const cols = [
      { key: 'id',   label: 'ID',   filterable: false },
      { key: 'name', label: 'Name' },
    ];
    render(<DataTable columns={cols} data={data} filterable />);
    // Only 1 filter input (for Name), not 2
    expect(screen.getAllByPlaceholderText('Filter…').length).toBe(1);
  });
});

// ─── Sorting ──────────────────────────────────────────────────────────────────

describe('DataTable – sorting', () => {
  // Returns the Name-column cell text for each data row (skips header row).
  // The tooltip renders the value twice inside the cell; grab the cell's first
  // direct child (TooltipWrapper) whose deepest text is the actual value.
  function getNameCellTexts() {
    const rows = screen.getAllByRole('row').slice(1); // skip header
    return rows.map((row) => {
      const cell = within(row).getAllByRole('cell')[1];
      // textContent includes the tooltip duplicate, e.g. "AliceAlice".
      // Divide by 2 to get the actual value length.
      const full = cell.textContent;
      return full.slice(0, full.length / 2);
    });
  }

  test('sorts ascending on first click', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} sortable />);
    await user.click(screen.getByTitle('Sort by Name'));
    const names = getNameCellTexts();
    expect(names).toEqual([...names].sort());
  });

  test('sorts descending on second click', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} sortable />);
    const header = screen.getByTitle('Sort by Name');
    await user.click(header);
    await user.click(header);
    const names = getNameCellTexts();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('clears sort on third click', async () => {
    const user = userEvent.setup();
    const originalOrder = data.map((r) => r.name);
    render(<DataTable columns={columns} data={data} sortable />);
    const header = screen.getByTitle('Sort by Name');
    await user.click(header);
    await user.click(header);
    await user.click(header);
    expect(getNameCellTexts()).toEqual(originalOrder);
  });

  test('col.sortable=true makes column sortable even without global sortable', async () => {
    const user = userEvent.setup();
    const cols = [
      { key: 'id',   label: 'ID'   },
      { key: 'name', label: 'Name', sortable: true },
    ];
    render(<DataTable columns={cols} data={data} />);
    expect(screen.getByTitle('Sort by Name')).toBeInTheDocument();
    await user.click(screen.getByTitle('Sort by Name'));
    expect(getNameCellTexts()[0]).toBe('Alice');
  });

  test('col.sortable=false disables sorting for that column even with global sortable', () => {
    const cols = [
      { key: 'id',   label: 'ID'   },
      { key: 'name', label: 'Name', sortable: false },
    ];
    render(<DataTable columns={cols} data={data} sortable />);
    expect(screen.queryByTitle('Sort by Name')).not.toBeInTheDocument();
  });

  test('sort icon shows ⇅ when unsorted', () => {
    render(<DataTable columns={columns} data={data} sortable />);
    expect(screen.getAllByText('⇅').length).toBe(columns.length);
  });
});

// ─── Row selection ────────────────────────────────────────────────────────────

describe('DataTable – row selection', () => {
  test('renders checkbox column when selectable', () => {
    render(<DataTable columns={columns} data={data} selectable />);
    const checkboxes = screen.getAllByRole('checkbox');
    // 1 header checkbox + 5 row checkboxes
    expect(checkboxes).toHaveLength(data.length + 1);
  });

  test('toggling a row checkbox calls onSelectionChange with selected rows', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<DataTable columns={columns} data={data} selectable rowKey="id" onSelectionChange={onChange} />);
    const [, firstRowCheckbox] = screen.getAllByRole('checkbox');
    await user.click(firstRowCheckbox);
    expect(onChange).toHaveBeenCalledWith([data[0]]);
  });

  test('header checkbox selects all visible rows', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<DataTable columns={columns} data={data} selectable rowKey="id" onSelectionChange={onChange} />);
    const [headerCheckbox] = screen.getAllByRole('checkbox');
    await user.click(headerCheckbox);
    expect(onChange).toHaveBeenCalledWith(data);
  });

  test('header checkbox deselects all when all are selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<DataTable columns={columns} data={data} selectable rowKey="id" onSelectionChange={onChange} />);
    const [headerCheckbox] = screen.getAllByRole('checkbox');
    await user.click(headerCheckbox); // select all
    await user.click(headerCheckbox); // deselect all
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  test('unchecking a selected row updates selection', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<DataTable columns={columns} data={data} selectable rowKey="id" onSelectionChange={onChange} />);
    const [, firstRowCheckbox] = screen.getAllByRole('checkbox');
    await user.click(firstRowCheckbox); // select
    await user.click(firstRowCheckbox); // deselect
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});

// ─── Pagination ───────────────────────────────────────────────────────────────

describe('DataTable – pagination', () => {
  const bigData = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    age: 20 + i,
  }));

  test('shows only pageSize rows per page', () => {
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} />);
    expect(hasText('Person 1')).toBe(true);
    expect(lacksText('Person 6')).toBe(true);
  });

  test('shows page info text', () => {
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} />);
    expect(screen.getByText('1–5 of 12')).toBeInTheDocument();
  });

  test('next page button advances page', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} />);
    await user.click(screen.getByTitle('Next page'));
    expect(hasText('Person 6')).toBe(true);
    expect(lacksText('Person 1')).toBe(true);
  });

  test('previous page button goes back', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} />);
    await user.click(screen.getByTitle('Next page'));
    await user.click(screen.getByTitle('Previous page'));
    expect(hasText('Person 1')).toBe(true);
  });

  test('first/last page buttons work', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} />);
    await user.click(screen.getByTitle('Last page'));
    expect(hasText('Person 11')).toBe(true);
    await user.click(screen.getByTitle('First page'));
    expect(hasText('Person 1')).toBe(true);
  });

  test('first/previous buttons are disabled on page 1', () => {
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} />);
    expect(screen.getByTitle('First page')).toBeDisabled();
    expect(screen.getByTitle('Previous page')).toBeDisabled();
  });

  test('next/last buttons are disabled on last page', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} />);
    await user.click(screen.getByTitle('Last page'));
    expect(screen.getByTitle('Next page')).toBeDisabled();
    expect(screen.getByTitle('Last page')).toBeDisabled();
  });

  test('page size selector is rendered when pageSizeOptions provided', () => {
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} pageSizeOptions={[5, 10, 25]} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('changing page size shows more rows', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={bigData} pagination pageSize={5} pageSizeOptions={[5, 10, 25]} />);
    await user.selectOptions(screen.getByRole('combobox'), '10');
    expect(hasText('Person 10')).toBe(true);
  });

  test('shows "0 rows" when no data', () => {
    render(<DataTable columns={columns} data={[]} pagination pageSize={5} />);
    expect(screen.getByText('0 rows')).toBeInTheDocument();
  });
});

// ─── rowKey ───────────────────────────────────────────────────────────────────

describe('DataTable – rowKey', () => {
  test('accepts a string rowKey', () => {
    render(<DataTable columns={columns} data={data} rowKey="id" />);
    expect(hasText('Alice')).toBe(true);
  });

  test('accepts a function rowKey', () => {
    render(<DataTable columns={columns} data={data} rowKey={(row) => `row-${row.id}`} />);
    expect(hasText('Alice')).toBe(true);
  });

  test('falls back to index when rowKey field is missing', () => {
    const noId = [{ name: 'Alice' }, { name: 'Bob' }];
    render(<DataTable columns={[{ key: 'name', label: 'Name' }]} data={noId} />);
    expect(hasText('Alice')).toBe(true);
  });
});

// ─── Integration ──────────────────────────────────────────────────────────────

describe('DataTable – integration', () => {
  test('search resets to page 1', async () => {
    const user = userEvent.setup();
    const bigData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: i === 15 ? 'SpecialName' : `Person ${i + 1}`,
      age: 20 + i,
    }));
    render(<DataTable columns={columns} data={bigData} searchable pagination pageSize={5} />);
    await user.click(screen.getByTitle('Next page'));
    expect(hasText('Person 6')).toBe(true);
    await user.type(screen.getByPlaceholderText('Search…'), 'SpecialName');
    expect(hasText('SpecialName')).toBe(true);
    expect(screen.getByText('1–1 of 1')).toBeInTheDocument();
  });

  test('column filter resets to page 1', async () => {
    const user = userEvent.setup();
    const bigData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: i === 15 ? 'SpecialName' : `Person ${i + 1}`,
      age: 20 + i,
    }));
    render(<DataTable columns={columns} data={bigData} filterable pagination pageSize={5} />);
    await user.click(screen.getByTitle('Next page'));
    const [, nameFilter] = screen.getAllByPlaceholderText('Filter…');
    await user.type(nameFilter, 'SpecialName');
    expect(hasText('SpecialName')).toBe(true);
    expect(screen.getByText('1–1 of 1')).toBeInTheDocument();
  });

  test('sort resets to page 1', async () => {
    const user = userEvent.setup();
    const bigData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Person ${String(20 - i).padStart(2, '0')}`,
      age: 20 + i,
    }));
    render(<DataTable columns={columns} data={bigData} sortable pagination pageSize={5} />);
    await user.click(screen.getByTitle('Next page'));
    await user.click(screen.getByTitle('Sort by Name'));
    expect(screen.getByText('Page 1 of 4')).toBeInTheDocument();
  });
});
