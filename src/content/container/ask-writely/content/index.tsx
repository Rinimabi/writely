import { Avatar, Button, Input, Tag, Tooltip } from 'antd';
import {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import cx from 'classnames';
import { List } from '../list';
import { ResultPanel } from '../result-panel';
import { PromptCenter } from '../prompts';
import { IcBaselineSend, Logo } from '@/components/icon';
import i18next from 'i18next';
import { IcOutlineKeyboardReturn } from '@/components/icon/return';
import { useView } from '../../store/view';
import { DashiconsMove } from '@/components/icon/drag';

export const Content: React.FC<PropsWithChildren> = () => {
  return <CenterContent />;
};

const CenterContent = forwardRef<HTMLDivElement>((_, ref) => {
  const [keyword, setkeyword] = useState<string>();
  const { viewStatus, goToInputPage } = useView();

  const handleClickIcon = useCallback(() => {
    goToInputPage();
  }, [goToInputPage]);

  if (viewStatus === 'icon') {
    return (
      <div onClick={handleClickIcon}>
        <Avatar
          className="cursor-pointer !opacity-90 hover:!opacity-100 !shadow-sm hover:!shadow-md !bg-black !text-2xl hover:!text-3xl !transition-all !duration-700 !flex !items-center !justify-center"
          icon={<Logo />}
        />
      </div>
    );
  }

  if (viewStatus === 'result') {
    return <ResultPanel text={keyword} />;
  }

  return <InputPanel keyword={keyword} onChange={setkeyword} />;
});

const InputPanel: React.FC<{
  keyword: string;
  onChange: (keyword: string, instruction?: string) => void;
}> = ({ onChange }) => {
  const { goToResult } = useView();
  const [value, setValue] = useState('');
  const promptCenter = useMemo(() => new PromptCenter(), []);
  const items = promptCenter.useDropDownItems(value);

  return (
    <>
      <div
        className={cx(
          'bg-zinc-10000 transition-all duration-500 relative w-[500px] shadow-md block'
        )}
      >
        <Input.TextArea
          className="!pl-8 animate-breathe"
          onPressEnter={() => {
            onChange(value);
            goToResult();
          }}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="Ask writely to..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div>
          <SendToWritelyTip>
            <div className="absolute right-2 bottom-2">
              <IcBaselineSend
                className={cx(
                  'w-4 h-4 text-gray-300',
                  !!value?.trim()?.length
                    ? 'text-zinc-900 cursor-pointer'
                    : 'text-zinc-300'
                )}
              />
            </div>
          </SendToWritelyTip>
        </div>
        <Button
          type="ghost"
          className="!absolute left-2 top-0 text-lg handle animate__animated animate__fadeInDown"
          icon={<DragTip />}
        ></Button>
      </div>
      <div
        className={cx(
          'w-80 bg-zinc-100 duration-500 transition-shadow block  shadow-md'
        )}
      >
        <List
          items={items}
          onClick={(item) => {
            onChange((item.instruction || '') + ' ' + item.label);
            goToResult();
          }}
        />
      </div>
    </>
  );
};

const SendToWritelyTip: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Tooltip
      title={
        <div>
          {i18next.t('Send to writely')} <IcOutlineKeyboardReturn />
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};

const DragTip: React.FC<PropsWithChildren> = () => {
  return (
    <Tooltip title={<div>{i18next.t('Drag')}</div>}>
      <div>
        <DashiconsMove />
      </div>
    </Tooltip>
  );
};
