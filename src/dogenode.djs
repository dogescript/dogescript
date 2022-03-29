so process
so readline
so vm

so ./parser as parser
so ./toJS as toJS

very config is obj
    'input': process giv stdin,
    'output': process giv stdout
wow
very rl is readline dose createInterface with config

very ctxSrc is obj
    'console': console
wow
very vmCtx is vm dose createContext with ctxSrc

such loopHandleInput much input
    go
        very statement is parser dose parseStatement with input
        very js is plz toJS with statement

        very result is vm dose runInContext with js vmCtx

        console dose loge with result

        plz loop
    catch ex
        rly ex isa parser giv IncompleteError
            rl dose question with '... ' much newInput
                input more '\n'
                input more newInput
                plz loopHandleInput with input
            wow
        but
            console dose error with ex

            plz loop
        wow
    wow
wow

such loop
    rl dose question with 'DOGE> ' loopHandleInput
wow

plz loop
