import type { RankedTester } from "@jsonforms/core";
import { vanillaCells } from "@jsonforms/vanilla-renderers";
import TextCell, { textCellTester } from "./renderer/cells/TextCell.tsx";

export const mantineCells: { tester: RankedTester; cell: any }[] = [
  { tester: textCellTester, cell: TextCell },
   ...vanillaCells
];