import type { MessageKey } from './vi';

/**
 * An English message with a count (ADR-0018 §9): `one` for 1, `other` for any other number,
 * picked by the message's one count slot (`COUNT_SLOTS`). A message with two counts takes no
 * plural form: word it without a noun after each count, or split it into keys.
 */
export interface PluralMessage {
  readonly one: string;
  readonly other: string;
}

/** The English catalogue: the keys of `vi.ts` only, so a key it does not know fails typecheck. */
export type EnglishMessages = Partial<Record<MessageKey, string | PluralMessage>>;

/**
 * English UI strings (ADR-0018 §9), translated screen by screen (G-12 … G-16) in the terms of
 * `CONTEXT.md` § Thuật ngữ tiếng Anh. A key missing here shows its Vietnamese; `en.test.ts` lists
 * them, and their number only goes down. Settings offers English once none is missing (G-16).
 */
export const en: EnglishMessages = {
  'nav.group.manage': 'Manage',
  'screen.overview': 'Overview',
  'screen.appointments': 'Appointments',
  'screen.customers': 'Customers',
  'screen.customer': 'Customer profile',
  'screen.reports': 'Reports',
  'screen.team': 'Team management',
  'screen.settings': 'Settings',
  'scope.label': 'View',
  'scope.pill': 'View: {name}',
  'scope.everyTeam': 'All teams',
  'scope.teamName': 'Team {name}',
  'scope.rmName': 'RM {name}',
  'scope.rmCount': '{rm} RM',
  'scope.viewingRm': 'Team {team} → {rm}',
  'dialog.close': 'Close dialog',
  'period.pick': 'Choose a period',
  'period.applies': 'A choice updates the numbers at once',
  'overview.mtdRange': '{range} (MTD)',
  // A money field (G-03b): the words of mockup ngon-ngu-tien-te.html #money, tied to the codes of
  // the reading (ADR-0018 §5); "whole cents" chosen by the Owner 14/11/2026.
  'money.read': '{amount} ({compact})',
  'money.placeholder': 'e.g. 500 Mil · 1.5 Bil',
  'money.placeholder.cents': 'e.g. 1,250.50 · 250K',
  'money.error.empty': 'Enter an amount.',
  'money.error.negative': 'Amounts cannot be negative.',
  'money.error.format': 'Could not read this amount. Type it like 1,500,000 or 1.5 Mil.',
  'money.error.format.cents': 'Could not read this amount. Type it like 1,250.50 or 250K.',
  'money.error.fraction': 'VNĐ amounts have no decimals.',
  'money.error.fraction.cents': 'Amounts must be whole cents.',
  // The cap of a fee (G-04), the mockup's sentence "Quá trần phí".
  'error.AMOUNT_TOO_LARGE': 'The maximum is {max} VNĐ.',
  'error.AMOUNT_TOO_LARGE.cents': 'The maximum is {max}.',
  // A backup of another currency (G-04), the mockup's dialog.
  'settings.backup.otherCurrency': 'The file uses {file}; the open data uses {expected}',
  'settings.backup.otherCurrencyHelp':
    'A database has one currency and the app does not convert. To use this file: Start over, choose {file} at the Currency step, then choose this file at the Data step. Your current data has not changed.',
  'money.error.too-large': 'This amount is too large.',
  'money.error.ambiguous': '"{text}" can be read two ways.',
  'money.mark': 'Use "," for thousands and "." for decimals.',
  'money.unit': 'The English interface uses K, Mil and Bil.',
  'money.didYouMean': 'Did you mean:',
  'money.pickOne': 'Pick one:',
  'money.fill': 'Fill in {text} = {amount}',
  'sep.equals': '=',
  // The words of each platform (Mac-5a): {mod} is ⌘ or Ctrl+, {store} the key store; the data
  // folder depends on the platform and the mode (ADR-0019 §2).
  'aiPanel.web.copyFailed':
    'Could not copy — select all of the text below ({mod}A in the box), then {mod}C. ChatGPT is open.',
  'aiPanel.web.bothFailed':
    'Could not copy or open the browser — select all of the text below ({mod}A in the box), {mod}C, then open chatgpt.com yourself.',
  'aiPanel.web.pastePlaceholder': 'Paste the answer from ChatGPT ({mod}V)',
  'aiError.AI_KEYRING': "Could not read or write the API key in this computer's key store.",
  'settingsAi.providerWeb': 'OpenCode is only in the desktop app.',
  'settingsAi.keyWeb': 'Only in the desktop app.',
  'settingsAi.keyHelp':
    'The API key is kept in {store} on this computer — never in the data file or a backup, and never shown again. Each computer enters its own key.',
  'settingsAi.keyNotSaved':
    'The API key was not saved. Try again; if it still fails, check {store}.',
  'settingsAi.keyStore.windows': 'Windows Credential Manager',
  'settingsAi.keyStore.mac': 'the macOS Keychain',
  'reports.exportFailedHelp':
    'Could not write to the exports folder of the data folder (the disk is full, or the app may not write there). The data in the app is not affected.',
  'storage.dataFolderModes':
    'Windows: %LOCALAPPDATA%\\com.heritas.lcrm, or Project2C-data next to the exe in portable mode; macOS: ~/Library/Application Support/com.heritas.lcrm',
  'storage.openFailedHelp':
    "The app has written nothing to the file. The automatic backups are in the backups folder of the data folder ({folder}): copy the newest one over project2c.db in the data folder to restore it, then close this window and open the app again. If the backups folder cannot be opened, first ask the computer's administrator for the right to read it again. The newest backup may be the faulty file itself: then copy the one before it, then older ones.",
  'storage.backupFailedHelp':
    'The data file has not changed; there is nothing to restore. The app copies it to the backups folder of the data folder ({folder}) before opening it: check that the disk has free space, that the folder is not read-only or held by another program, and that the user account in use may read and write it, then close this window and open the app again.',
  'storage.diskFullHelp':
    'The data file has not changed; there is nothing to restore. The app copies it to the backups folder of the data folder before opening it, but the disk that holds the data folder ({folder}) is full. Delete some files on that disk (for example old files in the exports folder of the data folder), then close this window and open the app again.',
  'storage.fileInUseHelp':
    "The data file is not damaged; there is nothing to restore. Another program (a backup, sync or antivirus tool, or one that opens SQLite files) has a file of the app's data folder ({folder}) open: close that program, then close this window and open the app again.",
  'storage.accessDeniedHelp':
    "The data file is not damaged; there is nothing to restore. Check that the data folder ({folder}) and its files are not read-only or locked (macOS: Locked in Finder's Get Info), and that the user account in use may write and delete files in it (a portable exe run from a read-only drive, or from a folder that needs administrator rights such as Program Files: copy the exe's whole folder elsewhere), then close this window and open the app again.",
  'storage.dataDirUnreachable': 'Cannot reach the data folder Project2C-data',
  'storage.dataDirUnreachableHelp':
    'The data file is not damaged; there is nothing to restore. The Project2C-data folder next to the exe is a link (junction) to a folder that is no longer there: the drive that holds it (a USB stick, a network drive) was removed or disconnected, or that folder was deleted or renamed. Plug in or reconnect that drive, or fix the link so it points to the data folder, then close this window and open the app again.',
  'settings.backup.exportHelp':
    'Writes all the data (soft-deleted records included) to the exports folder of the data folder.',
  'settings.backup.exportFailed':
    'The backup was not exported. Check the disk and the right to write to the exports folder of the data folder, then try again.',
  'settings.backup.exportTooLarge':
    'The backup was not exported: the data is over {limitMb} MB, so the file could not be imported again. Use a .db copy in the backups folder of the data folder instead: copy it over project2c.db while the app is closed.',
  'settings.backup.confirmBackup':
    'The current data is backed up first to the backups folder of the data folder. Importing does not merge data.',
  'settings.demo.confirmBackup':
    'The app first backs up the data file to the backups folder of the data folder (its path is in Settings → Data); to restore, copy that backup over project2c.db in the data folder while the app is closed.',
  'settings.demo.doneBackup': 'Backup: {file} (backups folder)',
  'toast.movedToTrash.appointment': 'Appointment moved to Trash',
  'toast.movedToTrash.customer': 'Customer moved to Trash',
  'toast.movedToTrash.policy': 'Policy moved to Trash',
  'toast.movedToTrash.team': 'Team moved to Trash',
  'toast.movedToTrash.person': 'Staff member moved to Trash',
  'toast.undo': 'Undo',
  'toast.undoGone': 'The record is no longer in Trash, so this cannot be undone.',
  'toast.close': 'Close notification',
  'toast.appointmentCreated': 'Appointment created',
  'trash.purge.backup':
    'The app first backs up the data file to the backups folder of the data folder (its path is in Settings → Data). To get the data back as it was before emptying: copy that backup over project2c.db in the data folder while the app is closed (the changes made since are lost).',
  'storage.saveDiskFull':
    'The data was not saved to the file: the disk that holds the data folder is full. Delete some files on that disk (for example old files in the exports folder of the data folder; its path is in Settings → Data). The data is still in the app and will be saved with the next change.',
  'storage.saveReadOnly':
    "The data was not saved to the file: the data file (Settings → Data) is read-only or locked, or the user account in use may not write or delete it. Turn read-only off (Windows: right-click the file → Properties → clear Read-only; macOS: select the file in Finder → Get Info → clear Locked, give Read & Write) or ask the computer's administrator to give the rights back. The data is still in the app and will be saved with the next change.",
  'storage.saveFolderReadOnly':
    "The data was not saved to the file: the data folder (its path is in Settings → Data) does not let the user account in use create new files in it. Ask the computer's administrator to give back the right to write to it. The data is still in the app and will be saved with the next change.",
  'close.unsavedBodyDiskFull':
    'The latest changes were not written to the file because the disk that holds the data folder is full. Delete some files on that disk (for example old files in the exports folder of the data folder; its path is in Settings → Data), then choose Try again, or close the app and drop the unsaved changes.',
  'close.unsavedBodyReadOnly':
    "The latest changes were not written to the file because the data file (Settings → Data) is read-only or locked, or the user account in use may not write or delete it. Turn read-only off (Windows: right-click the file → Properties → clear Read-only; macOS: select the file in Finder → Get Info → clear Locked, give Read & Write) or ask the computer's administrator to give the rights back, then choose Try again. Or close the app and drop the unsaved changes.",
  'close.unsavedBodyFolderReadOnly':
    "The latest changes were not written to the file because the data folder (its path is in Settings → Data) does not let the user account in use create new files in it. Ask the computer's administrator to give back the right to write to it, then choose Try again. Or close the app and drop the unsaved changes.",
  // The next step of an empty place, and the filter it names (VA3c, mockup components.html 09).
  'filter.clear': 'Clear filter',
  'appointments.dayEmptyNext': 'Pick a day with dots on the calendar to see its appointments.',
  'appointments.listEmpty': 'No appointments yet in {period}',
  'appointments.listEmptyNext': 'Create an appointment, or view another period.',
  'appointments.listNoMatch': 'No appointments match in {period}',
  'appointments.listNoMatchNext':
    'Filtering by Coordinator: {name}. Clear the filter or view another period.',
  'appointments.toThisMonth': 'Back to this month',
  'customers.empty': 'No customers yet in this view',
  'customers.emptyNext': 'Press "+ Customer" to add one.',
  'customer.notFoundNext':
    'Go back to Customers to pick another customer. A deleted customer is in Settings → Trash and can be restored.',
  'customer.noAppointmentsNext': 'Press "+ Appointment" at the top of the profile to create one.',
  'policies.emptyNext':
    'When the customer pays the premium, record the policy as submitted (FYP, submission date) → then issued (issue date).',
  'timeline.emptyNext': 'Filtering by: {label}. Clear the filter to see the whole timeline.',
  'trash.noMatchNext': 'Filtering by: {parts}. Remove a condition to see other records.',
  'trash.filter.kind': 'Kind {label}',
  'trash.filter.query': 'Name contains "{name}"',
  'team.noneNext': 'Press "+ Team" to create one.',
  'team.emptyNext': 'Press "+ Staff" to add an RM to this team.',
};
