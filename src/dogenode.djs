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

very vmCtx is vm dose createContext

such loop
    rl dose question with 'DOGE> ' much input
        go
            very statement is parser dose parseStatement with input
            very js is plz toJS with statement
            very result is vm dose runInContext with js vmCtx

            console dose loge with result
        catch ex
            console dose error with ex
        wow

        plz loop
    wow&
wow

plz loop
