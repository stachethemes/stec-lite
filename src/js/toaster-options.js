const toasterOptions = {
    containerClassName: 'stec-toaster',
    containerStyle: { zIndex: 100001 },
    position: "bottom-center",
    gutter: 10,
    toastOptions: {
        error: {
            iconTheme: {
                primary: '#fff',
                secondary: 'var(--stec-color-red)',
            },
            style: {
                backgroundColor: 'var(--stec-color-red)',
                color: '#fff'
            }
        },
        success: {
            iconTheme: {
                primary: '#fff',
                secondary: 'var(--stec-color-green)',
            },
            style: {
                backgroundColor: 'var(--stec-color-green)',
                color: '#fff'
            }
        },
        iconTheme: {
            primary: '#fff',
            secondary: 'var(--stec-color-blue)',
        },
        style: {
            textAlign: 'left',
            borderRadius: '3px',
            backgroundColor: 'var(--stec-color-blue)',
            color: '#fff',
            fontFamily: 'var(--stec-font-general)',
            fontSize: 14
        },
    }
}

export default toasterOptions;