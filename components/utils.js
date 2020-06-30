export const Flex = ({ children, row = false, column = true, grow = 0, ...props }) => (<>
    <div {...props}>
        {children}
    </div>

    <style jsx>{`
        div {
            margin: 0;
            display: flex;
            flex-direction: ${row ? 'row' : column ? 'column' : 'column'};

            flex-grow: ${grow};
        }
    `}</style>
</>);

export const FileInput = ({ description, fileType, ref }) => {
    return (<Flex column style={{ marginTop: '0.5em' }}>
            <input type="file" accept={fileType} ref={ref}/>

            {description && <><small>{description}</small></>}
    </Flex>);
};
