import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const DragUpload = function (props) {
  const draggerProps = {
    name: 'file',
    showUploadList: false,
    maxCount: 1,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      props.onDropDone(e.dataTransfer.files[0]);
    },
  };

  return (
    <Dragger {...draggerProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Upload {props.title} file: click or drag to this area</p>
      <p className="ant-upload-hint">{props.description}</p>
    </Dragger>
  );
}

export default DragUpload;