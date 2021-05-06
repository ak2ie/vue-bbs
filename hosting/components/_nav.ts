export default [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavItem",
        name: "ダッシュボード",
        to: "/admin",
        icon: "cil-speedometer",
        badge: {
          color: "primary",
          text: "NEW",
        },
      },
      {
        _name: "CSidebarNavTitle",
        _children: ["管理メニュー"],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "ユーザ管理",
        route: "/admin/users",
        icon: "cil-user",
        items: [
          {
            name: "ユーザ一覧",
            to: "/admin/users/list",
          },
          {
            name: "ユーザ新規登録",
            to: "/admin/users/new",
          },
        ],
      },
      {
        _name: "CSidebarNavItem",
        name: "設定",
        to: "/admin/configs",
        icon: "cil-puzzle",
      },
    ],
  },
];
