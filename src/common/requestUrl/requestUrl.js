let URL = '/sys/',
    // 登录相关
    url_login = URL + 'user/login',
    url_out = URL + 'user/logout',

    // 菜单相关
    // 创建菜单
    url_createMenu = URL + 'menu',
    // 删除菜单
    url_delMenu = URL + 'menu',
    // 当前用户菜单树 GET /sys/menu/user/tree
    url_menusList = URL + 'menu/user/tree',
    // 所有的菜单树GET /sys/menu/tree
    url_allMenu = URL + 'menu/tree',
    // 菜单分页查询按 
    url_pageMenu = URL + 'menu/list/page',

    // 当前用户信息
    url_info = URL + '/user/info';

// 角色相关
let url_role = URL + '/role',
    url_roleList = URL + '/role/list/page';

// 用户相关
let url_userList = URL + 'user/list/page',
    url_user = URL + 'user';
let url_un = URL + 'user/unauth';

// 数据源相关
let url_datasourceList = URL + 'datasource/list';
let url_data_tab = URL + 'datasource/list/table';

// 代码生成相关
let url_dataToCode = URL + 'code/generator/generate';

// 给某一角色分配一组菜单
let url_menu_role = URL + '/menu/role';

// 查询某一角色菜单
let url_menu_role_tree = URL + 'menu/role/tree'

// 角色分配到用户
let url_role_user = URL + 'role/user'

// 用户id查询角色
let url_userid_role = URL + 'role/list/user'



// 枚举分页查询
let url_enum_list = URL + 'enum/list/page'

// 枚举创建/修改
let url_enum = URL + 'enum'

// 枚举类型查询
let url_enum_type = URL + 'enum/list/type'

// 日志管理
let url_log_list = URL + 'log/list/page'

// 产品相关
let url_product_list = URL + 'platform/product/list/page'

// 产品操作
let url_product = URL + 'platform/product'

// 工作平台
let url_work_list = URL + 'work/platform/list/page'

// 工作平台操作
let url_work = URL + 'work/platform'

// 文章列表
let url_art_list = URL + 'article/data/list/page'
// 文章操作
let url_art = URL + 'article/data'
// 文章附件2列表
let url_art_files = URL + 'article/data/files'

// 获取当前用户权限
let url_perms = URL + 'menu/perms'
// 打包下载
let url_download_files = URL + 'article/data/download/package/files'

// 数据源操作
let url_datasource = URL + 'datasource'
// 刷新数据源
let url_datasource_refresh = URL + 'datasource/refresh'

// 重置数据源
let url_datasource_reset = URL + 'datasource/reset'

// 静态资源
let url_static_list = URL + 'staticData/list/page'
// 保存静态资源
let url_static = URL + 'staticData'

// 资源备份列表
let url_copy_list = URL + 'staticData/backups/list/page'

// 保存备份
let url_copy_save = URL + 'staticData/backups'

// 重置备份
let url_copy_up = URL + 'staticData/backups/reset'


export {
    url_login, url_out, url_menusList, url_allMenu, url_createMenu, url_delMenu, url_un, url_info, url_pageMenu,
    url_role, url_roleList,
    url_user, url_userList,
    url_datasourceList,url_data_tab,
    url_dataToCode,url_menu_role,url_menu_role_tree,
    url_role_user,url_userid_role,
    url_enum,url_enum_list,url_enum_type,
    url_log_list,url_product_list,url_product,
    url_work_list,url_work,
    url_art_list,url_art,url_art_files,url_perms,
    url_download_files,
    url_datasource,url_datasource_refresh,url_datasource_reset,
    url_static_list,url_static,url_copy_list,url_copy_save,url_copy_up
}