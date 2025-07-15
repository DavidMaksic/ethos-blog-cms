import { MdCancel, MdCheckCircle, MdError, MdInfo } from 'react-icons/md';
import { createReactBlockSpec } from '@blocknote/react';
import { defaultProps } from '@blocknote/core';
import { Menu } from '@mantine/core';

const alertTypes = [
   {
      title: 'Info',
      value: 'info',
      icon: MdInfo,
      color: '#507aff',
      backgroundColor: {
         light: '#e6ebff',
         dark: '#203380',
      },
   },
   {
      title: 'Warning',
      value: 'warning',
      icon: MdError,
      color: '#e69819',
      backgroundColor: {
         light: '#fff6e6',
         dark: '#805d20',
      },
   },
   {
      title: 'Error',
      value: 'error',
      icon: MdCancel,
      color: '#d80d0d',
      backgroundColor: {
         light: '#ffe6e6',
         dark: '#802020',
      },
   },
   {
      title: 'Success',
      value: 'success',
      icon: MdCheckCircle,
      color: '#0bc10b',
      backgroundColor: {
         light: '#e6ffe6',
         dark: '#208020',
      },
   },
];

export const Alert = createReactBlockSpec(
   {
      type: 'alert',
      propSchema: {
         textAlignment: defaultProps.textAlignment,
         textColor: defaultProps.textColor,
         type: {
            default: 'info',
            values: ['info', 'warning', 'error', 'success'],
         },
      },
      content: 'inline',
   },
   {
      render: (props) => {
         const alertType = alertTypes.find(
            (a) => a.value === props.block.props.type
         );
         const Icon = alertType.icon;

         return (
            <div className={'alert'} data-alert-type={props.block.props.type}>
               <Menu withinPortal={false}>
                  <Menu.Target>
                     <div
                        className={'alert-icon-wrapper'}
                        contentEditable={false}
                     >
                        <Icon
                           className={'alert-icon'}
                           data-alert-icon-type={props.block.props.type}
                           size={32}
                        />
                     </div>
                  </Menu.Target>

                  <Menu.Dropdown>
                     <Menu.Label>Box Type</Menu.Label>
                     <Menu.Divider />
                     {alertTypes.map((type) => {
                        const ItemIcon = type.icon;

                        return (
                           <Menu.Item
                              className=" font-default"
                              key={type.value}
                              leftSection={
                                 <ItemIcon
                                    className={'alert-icon size-4'}
                                    data-alert-icon-type={type.value}
                                 />
                              }
                              onClick={() =>
                                 props.editor.updateBlock(props.block, {
                                    type: 'alert',
                                    props: { type: type.value },
                                 })
                              }
                           >
                              <span className="text-md font-normal">
                                 {type.title}
                              </span>
                           </Menu.Item>
                        );
                     })}
                  </Menu.Dropdown>
               </Menu>

               <div className={'inline-content'} ref={props.contentRef} />
            </div>
         );
      },
   }
);
