import { generateTaskId, STATUS_ORDER, STATUS_LABELS, createSeedTasks } from '@/src/utils/taskUtils';

describe('taskUtils', () => {
  test('generateTaskId_returnsUniqueNonEmptyStrings_whenCalledMultipleTimes', () => {
    // Arrange / Act
    const id1 = generateTaskId();
    const id2 = generateTaskId();

    // Assert
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
    expect(id1).not.toEqual(id2);
  });

  test('statusOrder_containsThreeCanonicalStatuses_whenImported', () => {
    // Arrange / Act
    const order = STATUS_ORDER;

    // Assert
    expect(Array.isArray(order)).toBe(true);
    expect(order.length).toBe(3);
  });

  test('statusLabels_hasNonEmptyLabelForEveryStatusInOrder_whenImported', () => {
    // Arrange
    const order = STATUS_ORDER;

    // Act / Assert
    order.forEach((status) => {
      expect(STATUS_LABELS[status]).toBeDefined();
      expect(typeof STATUS_LABELS[status]).toBe('string');
      expect(STATUS_LABELS[status].length).toBeGreaterThan(0);
    });
  });

  test('createSeedTasks_returnsNonEmptyArrayOfValidTasks_whenCalled', () => {
    // Arrange / Act
    const seeds = createSeedTasks();

    // Assert
    expect(Array.isArray(seeds)).toBe(true);
    expect(seeds.length).toBeGreaterThan(0);
    seeds.forEach((task) => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('status');
      expect(STATUS_ORDER).toContain(task.status);
    });
  });

  test('createSeedTasks_producesUniqueIds_acrossAllSeedTasks', () => {
    // Arrange
    const seeds = createSeedTasks();

    // Act
    const ids = seeds.map((t) => t.id);
    const uniqueIds = new Set(ids);

    // Assert
    expect(uniqueIds.size).toBe(ids.length);
  });
});
