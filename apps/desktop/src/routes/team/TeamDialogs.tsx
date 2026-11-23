import { useState, type ReactNode } from 'react';
import { createTeam, softDeleteTeam, updateTeam } from '@p2c/db';
import {
  normalizeText,
  TEAM_COLORS,
  TEAM_ICONS,
  type Team,
  type TeamColor,
  type TeamIcon,
} from '@p2c/domain';
import { Button, Dialog, NavIcon, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { useTrashUndo } from '../../shell/Toasts';
import { retriesDelete } from './team-view';
import { teamNameClass, TeamTop } from './TeamLook';

/**
 * A row of choices of Tạo / Sửa team, Mặc định first (mockup `.swatches`, `.icon-pick`): radios
 * named by their group, each drawn by `draw`; the arrows move among them, as a radio group does.
 */
function LookChoices<T extends string>({
  name,
  label,
  options,
  nameOf,
  value,
  onChange,
  draw,
}: {
  name: string;
  label: string;
  options: readonly T[];
  nameOf: (option: T) => string;
  value: T | null;
  onChange: (value: T | null) => void;
  /** The look of a choice, `null` for Mặc định. */
  draw: (option: T | null) => ReactNode;
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
      <legend className="mb-1.5 p-0 text-sm font-medium">
        {label} <span className="font-normal text-fg-3">{t('team.optional')}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {[null, ...options].map((option) => {
          const shown = option ? nameOf(option) : t('team.lookDefault');
          return (
            <label key={option ?? ''} title={shown}>
              <input
                type="radio"
                name={name}
                className="peer sr-only"
                checked={option === value}
                onChange={() => onChange(option)}
                aria-label={shown}
              />
              {draw(option)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * What a choice of the colour looks like: a dot of it, ringed once picked, in its colour. Mặc định is
 * a dot of --fill-3, too faint for a ring, so its ring is --text-2 (mockup `.swatches .none.on`,
 * over 3:1 on the dialog).
 */
const swatch = (color: TeamColor | null) => (
  <span
    className={`block size-7 cursor-pointer rounded-full bg-current outline-offset-2 peer-checked:outline-2 peer-focus-visible:ring-2 peer-focus-visible:ring-fg ${
      color
        ? `${teamNameClass({ color })} peer-checked:outline-current`
        : 'text-fill-3 inset-ring inset-ring-border-control peer-checked:outline-fg-2'
    }`}
  />
);

/**
 * What a choice of the icon looks like: the icon on a square, gold once picked, under the pointer
 * too (mockup `.icon-pick button.on`): `peer-checked:hover:` outweighs `hover:`.
 */
const iconChoice = (icon: TeamIcon | null) => (
  <span
    className={`grid size-8.5 cursor-pointer place-items-center rounded-control bg-fill-2 text-fg-2 hover:bg-fill-3 hover:text-fg peer-checked:bg-accent-soft peer-checked:text-accent peer-checked:inset-ring-2 peer-checked:inset-ring-accent peer-checked:hover:bg-accent-soft peer-checked:hover:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent`}
  >
    <NavIcon name={icon ?? 'team'} />
  </span>
);

/**
 * Tạo / Sửa team (mockup search-rm-team.html `#team`, C3): a preview of the top of the team, its
 * name, then a colour and an icon, both optional; a refused name stays in the dialog. `lead` and
 * `rm` of the team edited, for the preview and the line under the title.
 */
export function TeamDialog({
  team,
  lead,
  rm = 0,
  onClose,
  onSaved,
}: {
  team?: Team;
  lead?: string;
  rm?: number;
  onClose: () => void;
  onSaved: (team: Team) => void;
}) {
  const data = useAppData();
  const [name, setName] = useState(team?.name ?? '');
  const [color, setColor] = useState(team?.color ?? null);
  const [icon, setIcon] = useState(team?.icon ?? null);
  const [error, setError] = useState<string>();
  const leadText = lead ?? t('team.noLead');

  const save = () => {
    try {
      const input = { name, color, icon };
      onSaved(data.run((db) => (team ? updateTeam(db, team.id, input) : createTeam(db, input))));
    } catch (failure) {
      setError(errorMessage(failure, { name: normalizeText(name) }));
    }
  };

  return (
    <Dialog
      closeLabel={t('dialog.close')}
      title={t(team ? 'team.edit' : 'team.new')}
      subtitle={
        team
          ? t('team.editSub', {
              team: team.name,
              rm,
              name: lead ? t('rmPage.lead', { name: lead }) : leadText,
            })
          : t('team.newSub')
      }
      onClose={onClose}
      onSubmit={save}
      actions={
        <>
          <Button onClick={onClose}>{t('team.cancel')}</Button>
          <Button type="submit" variant="primary">
            {t(team ? 'team.save' : 'team.create')}
          </Button>
        </>
      }
    >
      <figure aria-label={t('team.preview')} className="m-0 rounded-card bg-fill-1 px-4 py-3.5">
        <TeamTop
          small
          team={{ name: normalizeText(name) || t('team.nameLabel'), color, icon }}
          lead={lead ?? <span className="font-normal text-fg-3">{leadText}</span>}
        />
      </figure>
      <TextField
        label={t('team.nameLabel')}
        value={name}
        onChange={(value) => {
          setName(value);
          setError(undefined);
        }}
        error={error}
        required
        autoFocus
      />
      <LookChoices
        name="color"
        label={t('team.colorLabel')}
        options={TEAM_COLORS}
        nameOf={(option) => t(`team.color.${option}`)}
        value={color}
        onChange={setColor}
        draw={swatch}
      />
      <LookChoices
        name="icon"
        label={t('team.iconLabel')}
        options={TEAM_ICONS}
        nameOf={(option) => t(`team.icon.${option}`)}
        value={icon}
        onChange={setIcon}
        draw={iconChoice}
      />
      <p className="m-0 text-xs text-fg-3">{t('team.lookHelp')}</p>
    </Dialog>
  );
}

/**
 * Soft-deletes a team; one that still has people is refused with the reason, and Xóa stays off
 * unless the refusal says to try again.
 */
export function DeleteTeamDialog({ team, onClose }: { team: Team; onClose: () => void }) {
  const data = useAppData();
  const undo = useTrashUndo();
  const [error, setError] = useState<string>();
  const [final, setFinal] = useState(false);

  const remove = () => {
    try {
      data.run((db) => softDeleteTeam(db, team.id));
      undo('team', team.id);
      onClose();
    } catch (failure) {
      setError(errorMessage(failure));
      setFinal(!retriesDelete(failure));
    }
  };

  return (
    <Dialog
      closeLabel={t('dialog.close')}
      size="confirm"
      title={t('team.deleteTitle', { name: team.name })}
      onClose={onClose}
      onSubmit={remove}
      actions={
        <>
          <Button onClick={onClose}>{t('team.close')}</Button>
          <Button type="submit" variant="danger" disabled={final}>
            {t('team.deleteConfirm')}
          </Button>
        </>
      }
    >
      <p className="m-0">{t('team.deleteBody')}</p>
      {error && (
        <p role="alert" className="m-0 text-danger">
          {error}
        </p>
      )}
    </Dialog>
  );
}
