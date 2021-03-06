export type TargetGenerator = () => string[]

export type SiTarget = string | string[] | TargetGenerator

export type SelectorProps = {
    type?: 'text' | 'prop' | 'attr'
    name?: string
    formatter?: (text: string) => any
}

export type DebugLevel = '0' | '1' | '2'

export type FieldProps = {
    selector: string
    selectorProps?: SelectorProps
}

/** 抓取配置 */
export type SiOptions = {
    /** 目标dom选择器 */
    selector: string
    /** 单项数据的 key 选择器 */
    // key: FieldProps
    onEmitPageData?: (error: any, pageData: any) => void    // todo pageData 类型
    /** 附加字段信息 */
    fields: {
        [field: string]: FieldProps
    }
    /** 分页相关设计 */
    pagination?: {
        /** dom选择 */
        totalPage?: FieldProps
        formatFieldsValue?: (value: string) => number
        /**  选定页面 (适用于测试或只有单独一层数据时) */
        // range?: [number, number]
        /** 分页地址组合 */
        composeUrlFn?: (target: string, page: number | string) => string
    }
    /** 过滤器 */
    filter?: (item: CollectRowListItem) => boolean
    /** 间隔时间 */
    interval?: number
    /** 并发数 */
    parallel?: number
    /** 重试次数 */
    retryTimes?: number
    /** debug level */
    debugLevel?: DebugLevel
}

/** 爬虫配置 */
export type SiConfig = {
    /** 页面地址 */
    target: SiTarget
    /** 抓取配置 */
    options: SiOptions
}

export type CollectRowListItem = {
    [props: string]: any
}

/** 返回的数据格式 */
export type PageData = {
    list: CollectRowListItem[]
    pagination?: {
        totalPage?: string
        nextPage?: string
    }
}

/** 执行句柄 */
type TaskHandler = (...args: any) => Promise<any>
/**
 * 并发任务配置
 */
export type MapTaskConfig = {
    /**`任务列表(待执行函数) */
    taskList: TaskHandler[]
    /** 单任务回调 */
    onEmitPageData?: (error: any, data: any) => void
    /** 并发数 */
    parallel?: number
    /** 任务间隔 */
    interval?: number
}
export type MapDynamicTaskConfig = {
    /**`任务列表(待执行函数) */
    taskList: TaskHandler[]
    /** 单任务回调 */
    onEmitPageData?: (error: any, data: any) => void
    /** 并发数 */
    parallel?: number
    /** 任务间隔 */
    interval?: number
}
export type MapTask = (config: MapTaskConfig) => Promise<any[]>
export type AddTask = (taskList: MapTaskConfig['taskList']) => void
