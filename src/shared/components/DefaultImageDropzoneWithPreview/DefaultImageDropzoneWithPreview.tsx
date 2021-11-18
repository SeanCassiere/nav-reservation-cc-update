import React, { useCallback, useMemo, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Figure from "react-bootstrap/esm/Figure";
import { useDropzone } from "react-dropzone";

const baseStyle = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: "20px 20px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "#eeeeee",
	borderStyle: "dashed",
	backgroundColor: "#fafafa",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out",
};

const activeStyle = {
	borderColor: "#2196f3",
};

const acceptStyle = {
	borderColor: "#00e676",
};

const rejectStyle = {
	borderColor: "#ff1744",
};

interface IProps {
	dragDisplayText: string;
	selectButtonText: string;
	clearButtonText: string;
	onSelectFile?: (file: File) => void;
	onClearFile?: () => void;
}

const DefaultImageDropzoneWithPreview = ({
	dragDisplayText,
	clearButtonText,
	selectButtonText,
	onSelectFile,
	onClearFile,
}: IProps) => {
	const [previewImage, setPreviewImage] = useState<{ fileName: string; url: string } | null>(null);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			const objectUrl = URL.createObjectURL(file);
			setPreviewImage({ fileName: file.name, url: objectUrl });

			if (onSelectFile) {
				// callBack to lift file to parent state
				onSelectFile(file);
			}
		},
		[onSelectFile]
	);

	const handleClearImage = useCallback(() => {
		setPreviewImage(null);
		if (onClearFile) onClearFile();
	}, [onClearFile]);

	const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
		accept: "image/*",
		noClick: true,
		noKeyboard: true,
		maxFiles: 1,
		onDrop,
	});

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isDragActive, isDragAccept, isDragReject]
	);
	return (
		<>
			<div {...getRootProps({ style: style as any })}>
				<input {...getInputProps()} />
				{previewImage ? (
					<Figure style={{ width: "100%", textAlign: "center", margin: 0 }}>
						<Figure.Image alt={previewImage.fileName} src={previewImage.url} style={{ height: "130px" }} />
						<Figure.Caption>{previewImage.fileName}</Figure.Caption>
					</Figure>
				) : (
					<p>{dragDisplayText}</p>
				)}
			</div>
			<div className='mt-2'>
				{previewImage ? (
					<Button variant='danger' style={{ width: "100%" }} onClick={handleClearImage}>
						{clearButtonText}
					</Button>
				) : (
					<Button variant='secondary' style={{ width: "100%" }} onClick={open}>
						{selectButtonText}
					</Button>
				)}
			</div>
		</>
	);
};

export default DefaultImageDropzoneWithPreview;
